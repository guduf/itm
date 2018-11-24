/// <reference path="../../../node_modules/monaco-editor/monaco.d.ts" />

const JSON_SCHEMAS = ['area', 'grid'];

const JSON_SCHEMAS_ENDPOINT = '/assets/schemas';

(self as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') return './monaco/json.worker.js';
    if (label === 'typescript' || label === 'javascript') return './monaco/ts.worker.js';
    return './monaco/editor.worker.js';
  }
};

async function _loadJsonSchemas(): Promise<void> {
  const patterns = await Promise.all(JSON_SCHEMAS.map(async key => {
    const filename = `${key}.json`;
    const uri = `${JSON_SCHEMAS_ENDPOINT}/${filename}`;
    const res = await fetch(uri);
    const schema = await res.json();
    return {uri, schema, fileMatch: [key, filename, `*.${filename}`]};
  }));
  const schemaMap = patterns.reduce((acc, {schema}) => ({...acc, [schema.$id]: schema}), {});
  const schemas = patterns.map(pattern => ({
    ...pattern,
    schema: {
      ...pattern.schema,
      definitions: Object.keys(pattern.schema.definitions || {}).reduce(
        (acc, key) => ({
          ...acc,
          [key]: (
            pattern.schema.definitions[key].$ref ?
              schemaMap[pattern.schema.definitions[key].$ref] :
              pattern.schema.definitions[key]
          )
        }),
        {}
      )
    }
  }));
  console.log({schemaMap, schemas});
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({validate: true, schemas});
}

(self as any).initMonaco = async function initMonaco(): Promise<void> {
  await import('monaco-editor');
  await _loadJsonSchemas();
};

(self as any).createJsonEditor = function(
  elem: HTMLElement,
  filename: string,
  code = `{\n}\n`,
  onDidChangeContent: (content: string) => void = () => {}
): () => void {
  const modelUri = monaco.Uri.parse('monaco://' + filename);
  const model = monaco.editor.createModel(code, 'json', modelUri);
  const editor = monaco.editor.create(elem, {model, theme: 'vs-dark', minimap: {enabled: false}});
  const subscr = model.onDidChangeContent(() => onDidChangeContent(model.getValue()));
  return () => {
    model.dispose();
    editor.dispose();
    subscr.dispose();
  };
};
