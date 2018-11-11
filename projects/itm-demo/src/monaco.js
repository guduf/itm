// import * as monaco from 'monaco-editor';
import areaSchema from './json_schemas/area';
import * as monaco from 'monaco-editor';

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return './monaco/json.worker.bundle.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './monaco/ts.worker.bundle.js';
		}
		return './monaco/editor.worker.bundle.js';
	}
}
var jsonCode = [
  '{',
  '    "key": "",',
  '    "text": "",',
  '    "size": {',
  '      "width": 1,',
  '      "flexWidth": 1,',
  '      "height": 1,',
  '      "flexHeight": 1',
  '    }',
  "}"
].join('\n');

function createEditor(nativeElement, opts) {
  // const areaModelUri = monaco.Uri.parse(areaSchema.$id); // a made up unique URI for our model
  // const model = monaco.editor.createModel(jsonCode, 'json', areaModelUri);
  // monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
  //   validate: true,
  //   schemas: [{
  //     uri: areaModelUri, // id of the first schema
  //     fileMatch: [areaModelUri.toString()], // associate with our model
  //     schema: areaSchema
  //   }]
  // });

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2016,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    typeRoots: ["node_modules/@types"],
    lib: []
  });

  // extra libraries
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `export declare function of(): string`,
      'node_modules/@types/rxjs/index.d.ts');
      monaco.languages.typescript.typescriptDefaults.addExtraLib('declare const arr: string[]; declare module "foo" { };')
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
  })

  var jsCode = `import { of } from "rxjs"
      const tt : string = of();`;
  const model = monaco.editor.createModel(jsCode,"typescript",new monaco.Uri("main.tsx"));

  const e = monaco.editor.create(nativeElement, {
      model
  });

  e.seth
}

if (typeof window !== 'undefined') window.createEditor = createEditor;
