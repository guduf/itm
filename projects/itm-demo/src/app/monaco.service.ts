import { DOCUMENT } from '@angular/common';
import { Injectable, APP_INITIALIZER, NgZone, Inject } from '@angular/core';
import { Map } from 'immutable';
import * as monaco from 'monaco-editor';
import { parseIter } from '../../../itm-core/src/lib/utils';

declare const loadMonaco: () => Promise<typeof monaco>;
// tslint:disable-next-line:max-line-length
declare const createEditor: (nativeElement: HTMLElement, opts?: monaco.editor.IEditorConstructionOptions) => monaco.editor.IStandaloneCodeEditor;

@Injectable()
export class MonacoService {
  private _monaco: typeof monaco;
  private _schemas = Map<string, { $id: string}>();

  constructor(
    @Inject(DOCUMENT)
    private _document: Document,
    private _ngZone: NgZone
  ) { }

  createJsonEditor(
    nativeElement: HTMLElement,
    schemaUri: string
  ): monaco.editor.IStandaloneCodeEditor {
    return createEditor(nativeElement);
  }

  load(): Promise<void> {
    return this._ngZone.runOutsideAngular(() => {
      const loadScript = new Promise(resolve => {
        const script = this._document.createElement('script');
        script.type = 'text/javascript';
        script.src = '/monaco/runtime.bundle.js';
        script.onload = resolve;
        this._document.body.appendChild(script);
      });
      return loadScript
      .then(() => loadMonaco())
      .then(_monaco => (this._monaco = _monaco))
      .then(() => Promise.all(['area'].map(uri => this._loadSchema(uri))))
      .then(schemas => this._setJsonSchema(...schemas));
    });
  }

  private _loadSchema(uri: string): Promise<{ $id: string }> {
    return this._ngZone.runOutsideAngular(() => {
      return fetch(`/assets/json_schemas/${uri}.json`).then(res => res.json());
    });
  }

  private _setJsonSchema(...schemas: { $id: string }[]): void {
    this._schemas = this._schemas.merge(parseIter(schemas, '$id'));
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: this._schemas.reduce(
        (acc, schema) => ([...acc, {uri: schema.$id, fileMatch: [schema.$id], schema}]),
        []
      )
    });
  }
}

export function loadFactory(service: MonacoService): () => Promise<void> {
  return service.load.bind(service);
}

export const MONACO_PROVIDERS = [
  {provide: MonacoService, useClass: MonacoService},
  {provide: APP_INITIALIZER, multi: true, deps: [MonacoService], useFactory: loadFactory}
];
