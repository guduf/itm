self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') return './monaco/json.worker.bundle.js';
		if (label === 'typescript' || label === 'javascript') return './monaco/ts.worker.bundle.js';
		return './monaco/editor.worker.bundle.js';
  }
}

window.loadMonaco = function () { return import('monaco-editor').then(() => self.monaco); };
window.createEditor = function() {
  const schema = this._schemas.get(schemaUri);
  // tslint:disable-next-line:max-line-length
  if (!schema) throw new ReferenceError(`Missing schema with uri: ${schemaUri}`);
  const model = monaco.editor.createModel('', 'json', monaco.Uri.parse(schema.$id));

  return self.monaco.create(nativeElement, {model});
}
// const JSON_CONSTRUCTION_OPTIONS = {
// 	lineNumbers: 'off',
// 	scrollBeyondLastLine: false,
// 	theme: 'vs-dark'
// };


// function createEditor(nativeElement, type, opts) {
//   const sub = monaco.languages.typescript.typescriptDefaults.addExtraLib('declare const arr: string[]; declare module "foo" { };')
//   sub.
//   monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
//       noSemanticValidation: false,
//       noSyntaxValidation: false
//   })

//   var jsCode = `import { of } from "rxjs"
//       const tt : string = of();`;
//   const model = monaco.editor.createModel(jsCode,"typescript",new monaco.Uri("main.tsx"));

//    monaco.editor.create(nativeElement, {
//       model
//   });
// }

// if (typeof window !== 'undefined') window.createEditor = createEditor;
