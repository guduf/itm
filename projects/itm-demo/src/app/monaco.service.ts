// import { Injectable, APP_INITIALIZER, NgZone } from '@angular/core';
// import * as Monaco from 'monaco-editor';

// @Injectable()
// export class MonacoService {
//   private _monaco: typeof Monaco;

//   constructor(private _ngZone: NgZone) { console.log(this._ngZone); }

//   load(): Promise<void> {
//     return this._ngZone.runOutsideAngular(() => new Promise(resolve => {
//       const script = document.createElement('script');
//       script.type = 'text/javascript';
//       script.src = 'monaco-editor/loader.js';
//       script.onload = () => {
//         (window as any).require.config({
//           paths: {vs: 'monaco-editor'}
//         });
//         (window as any).require(['vs/editor/editor.main'], () => {
//           this._monaco = (window as any).monaco;
//           resolve();
//         });
//       };
//       document.body.appendChild(script);
//     }));
//   }

//   create(nativeElement: HTMLElement) {
//     return this._ngZone.runOutsideAngular(() => this._monaco.editor.create(nativeElement, {
//       value: [
//         'function x() {',
//         '\tconsole.log("Hello world!");',
//         '}'
//       ].join('\n'),
//       language: 'javascript'
//     }));
//   }
// }

// export function loadMonaco(service: MonacoService): () => Promise<void> {
//   return service.load.bind(service);
// }

// export const MONACO_PROVIDERS = [
//   {provide: MonacoService, useClass: MonacoService},
//   {provide: APP_INITIALIZER, multi: true, deps: [MonacoService], useFactory: loadMonaco}
// ];
