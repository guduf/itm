/// <reference path="../../../../../node_modules/monaco-editor/monaco.d.ts" />

import * as Ajv from 'ajv';
import { ErrorObject } from 'ajv';
import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _m from 'monaco-editor';
import { Observable, from } from 'rxjs';
import { map, mergeMap, reduce } from 'rxjs/operators';

const JSON_SCHEMAS = ['target.json', 'area.json', 'grid.json'];

const JSON_SCHEMAS_ENDPOINT = '/assets/schemas';

const DEFAULT_EDITOR_OPTIONS: EditorOptions = {
  theme: 'vs-dark',
  minimap: {enabled: false},
  automaticLayout: true
};

export type EditorOptions = monaco.editor.IEditorConstructionOptions & { model?: never };

export interface InvalidEditorModel {
  valid: false;
  errors: ErrorObject[];
}

export interface ValidEditorModel<T extends Object = Object> {
  valid: true;
  value: T;
}

export type EditorModel<T extends Object = Object> = ValidEditorModel<T> | InvalidEditorModel;

@Injectable()
export class EditorService {
  get loaded() { return this._loaded; }

  private readonly _ajv = new Ajv();
  private _monaco: typeof _m;

  private _loaded = false;
  private _loading: Promise<true>;

  constructor(
    private _http: HttpClient,
    private _zone: NgZone
  ) { }

  createJsonEditor<T>(
    elem: HTMLElement,
    filename: string,
    code = `{\n}\n`,
    opts: EditorOptions = {}
  ): Observable<EditorModel<T>> {
    return this._run(() => {
      return new Observable(emitter => {
        const modelUri = this._monaco.Uri.parse('monaco://' + filename);
        const model = this._monaco.editor.createModel(code, 'json', modelUri);
        const editor = this._monaco.editor.create(elem, {
          ...DEFAULT_EDITOR_OPTIONS,
          ...opts,
          model
        });
        const handleChange = () => {
          let value: any;
          try { value = JSON.parse(model.getValue()); }
          catch { value = null; }
          this._ajv.validate(filename, value);
          if (!value || this._ajv.errors) return (
            emitter.next({valid: false, errors: this._ajv.errors})
          );
          return emitter.next({valid: true, value});
        };
        handleChange();
        const changes = model.onDidChangeContent(handleChange);
        return () => {
          model.dispose();
          editor.dispose();
          changes.dispose();
        };
      });
    });
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
    return from(JSON_SCHEMAS).pipe(
      mergeMap(key => {
        const uri = `${JSON_SCHEMAS_ENDPOINT}/${key}`;
        return this._http.get<any>(uri, {responseType: 'json'}).pipe(
          map((schema) => ({[key]: schema}))
        );
      }),
      reduce((acc, val) => ({...acc, ...val})),
      map(schemas => this._resolveSchemas(schemas)),
      map(schemas => {
        const monacoSchemas = schemas.map(schema => {
          const uri = schema.$id;
          const filename = uri.match(/(\w+.json)$/)[1];
          this._ajv.addSchema(schema, filename);
          return {uri, schema, fileMatch: [filename, `*.${filename}`]};
        });
        this._monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
          validate: true,
          schemas: monacoSchemas
        });
      })
    )
    .toPromise();
  }

  private _resolveSchemas(schemas: { [key: string]: any; }): any[] {
    const resolved: { [key: string]: any; } = {};
    Object.keys(schemas).forEach(key => {
      const schema = schemas[key];
      const defs = schema.definitions || {};
      resolved[key] = {
        ...schema,
        definitions: Object.keys(defs).reduce(
          (acc, defKey) => ({
            ...acc,
            [defKey]: defs[defKey].$ref ? resolved[defs[defKey].$ref] : defs[defKey]
          }),
          {}
        )
      };
    });
    return Array.from(Object.values(resolved));
  }

  private _run<T>(fn: () => T) { return this._zone.runOutsideAngular(fn); }
}
