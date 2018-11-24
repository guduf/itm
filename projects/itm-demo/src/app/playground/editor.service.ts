import { Injectable, NgZone } from '@angular/core';
import * as _m from 'monaco-editor';

const JSON_SCHEMAS = ['area', 'grid'];

const JSON_SCHEMAS_ENDPOINT = '/assets/schemas';

@Injectable()
export class EditorService {
  get loaded() { return this._loaded; }

  private _monaco: typeof _m;

  private _loaded = false;
  private _loading: Promise<true>;

  constructor(
    private _zone: NgZone
  ) { }

  createJsonEditor(
    elem: HTMLElement,
    filename: string,
    code = `{\n}\n`,
    onDidChangeContent: (content: string) => void = () => {}
  ): () => void {
    const modelUri = this._monaco.Uri.parse('monaco://' + filename);
    const model = this._monaco.editor.createModel(code, 'json', modelUri);
    const opts = {model, theme: 'vs-dark', minimap: {enabled: false}};
    const editor = this._monaco.editor.create(elem, opts);
    const subscr = model.onDidChangeContent(() => onDidChangeContent(model.getValue()));
    return () => {
      model.dispose();
      editor.dispose();
      subscr.dispose();
    };
  }

  load(): Promise<true> {
    if (this._loaded) return Promise.resolve<true>(true);
    if (this._loading) return this._loading;
    this._loading = this._run(async () => {
      const script = document.createElement('script');
      script.src = '/monaco/runtime.js';
      const onLoad = new Promise(resolve => script.onload = resolve);
      document.body.appendChild(script);
      return onLoad
        .then(() => (window as any).initMonaco())
        .then(monaco => (this._monaco = monaco))
        .then(() => this._loadJsonSchemas())
        .then(() => (this._loaded = true) as true);
    });
    return this._loading;
  }

  async _loadJsonSchemas(): Promise<void> {
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
    this._monaco.languages.json.jsonDefaults.setDiagnosticsOptions({validate: true, schemas});
  }

  private _run<T>(fn: () => T) { return this._zone.runOutsideAngular(fn); }
}
