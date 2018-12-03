/// <reference path="../../../../../node_modules/monaco-editor/monaco.d.ts" />

import * as Ajv from 'ajv';
import { ErrorObject } from 'ajv';
import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _m from 'monaco-editor';
import { Observable, defer, forkJoin } from 'rxjs';
import { map, reduce, concatAll } from 'rxjs/operators';
import { JSONSchema7 } from 'json-schema';

const JSON_SCHEMAS = ['target.json', 'area.json', 'field.json', 'control.json', 'grid.json'];

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
    if (this._loading) return this._loading;
    this._loading = this._run(async () => {
      if (this._loaded) return true as true;
      const script = document.createElement('script');
      script.src = '/monaco/runtime.js';
      const onLoad = new Promise(resolve => script.onload = resolve);
      document.body.appendChild(script);
      await onLoad;
      await (window as any).initMonaco();
      this._monaco = (window as any).monaco;
      await this._loadJsonSchemas();
      return this._loaded = true as true;
    });
    return this._loading;
  }

  _loadJsonSchemas(): Promise<void> {
    const schemaReqs = [
      defer(() => (
        this._http.get<any>('//json-schema.org/draft-07/schema', {responseType: 'json'}).pipe(
          map((schema) => ({'schema.json': schema}))
        )
      )),
      ...JSON_SCHEMAS.map(key => {
        const uri = `${JSON_SCHEMAS_ENDPOINT}/${key}`;
        return defer(() => this._http.get<any>(uri, {responseType: 'json'}).pipe(
          map((schema) => ({[key]: schema}))
        ));
      })
    ];
    return forkJoin(schemaReqs).pipe(
      concatAll(),
      reduce((acc, val) => ({...acc, ...val})),
      map(schemas => this._resolveSchemas(schemas).slice(1)),
      map(schemas => {
        const monacoSchemas = schemas.map(schema => {
          const uri = schema.$id;
          const filename = uri.match(/(\w+)(?:\.json)?#?$/)[1] + '.json';
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

  // tslint:disable-next-line:max-line-length
  private _resolveSchemas(schemas: { [key: string]: JSONSchema7; }): JSONSchema7[] {
    const resolved: { [$ref: string]: JSONSchema7; } = {};
    return Object.keys(schemas).reduce(
      (acc, key) => {
        const schema = schemas[key];
        let definitions = schema.definitions || {};
        definitions = Object.keys(definitions).reduce(
          (defAcc, defKey) => {
            let def = (
              typeof definitions[defKey] === 'object' ?  definitions[defKey] : {}
            ) as JSONSchema7;
            def = def.$ref && resolved[def.$ref] ? resolved[def.$ref] : def;
            return {...defAcc, ...def.definitions, [defKey]: def};
          },
          {}
        );
        resolved[schema.$id] = {...schema, definitions};
        return [...acc, resolved[schema.$id]];
      },
      []
    );
  }

  private _run<T>(fn: () => T) { return this._zone.runOutsideAngular(fn); }
}
