import { Optional } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors as NgValidationErrors
} from '@angular/forms';
import { Map, RecordOf, Collection, isCollection } from 'immutable';

import Area from './area';
import Field from './field';
import Target from './target';
import { isEnumIncludes } from './utils';
import { of, Observable } from 'rxjs';

export class ItmFormRef<T extends Object = {}> extends FormGroup {
  controls: { [P in keyof T]: ItmControlRef };

  constructor(records: Collection<any, ItmControl>, init: T = {} as T) {
    const controls = records.reduce(
      (acc, control) => {
        const controlRef = new ItmControlRef(control, init);
        return {...(acc as {}), [control.key]: controlRef};
      },
      {} as { [P in keyof T]: ItmControlRef }
    );
    super(controls);
  }

  get(path: Array<string | number> | string): ItmControlRef | null {
    return super.get(path) as ItmControlRef;
  }
}

// tslint:disable-next-line:max-line-length
export class ItmControlRef<T extends Object = {}> extends FormControl {
  readonly record: ItmControl;

  parent: ItmFormRef<T>;

  constructor(record: ItmControl, init: T) {
    super(init[record.key], null, (c: this) => ItmControl.validateSchema(c, record));
    this.record = record;
  }
}

export type ItmControl<T extends Object = {}> = Field<T> & RecordOf<ItmControl.Model<T>>;

export module ItmControl {
  export enum Type {
    number = 'number',
    string = 'string'
  }

  export interface ValidationErrors extends NgValidationErrors {
    [key: string]: boolean | string;
  }
  // TODO - IterSchema

  export interface ModelConfig<T extends Object = {}> {
    type?: Type;
    pattern?: RegExp;
    required?: boolean;
    min?: number;
    max?: number;
    enum?: Collection<any, any>;
    validator?: Target.Pipe<ItmControlRef<T>, ValidationErrors>;
  }

  export interface Model<T extends Object = {}> extends ModelConfig<T> {
    type: Type;
    pattern: RegExp | null;
    required: boolean;
    min: number | null;
    max: number | null;
    enum: Collection<any, any> | null;
    validator: Target.Pipe<AbstractControl, ValidationErrors> | null;
  }

  const serializer = (cfg: ModelConfig): Model => {
    if (cfg.type && !isEnumIncludes(Type, cfg.type)) throw new TypeError('Expected control type');
    return {
      type: cfg.type || Type.string,
      pattern: cfg.pattern instanceof RegExp ? cfg.pattern : null,
      required: typeof cfg.required === 'boolean' ? cfg.required : false,
      max: typeof cfg.max === 'number' ? cfg.max || 0 : null,
      min: typeof cfg.min === 'number' ? cfg.min || 0 : null,
      enum: isCollection(cfg.enum) ? cfg.enum : null,
      validator: cfg.validator ? Target.defer(Object, cfg.validator) : null
    };
  };

  export const selector = 'control';

  export type Config<T extends Object = {}> = Field.Config<T> & ModelConfig<T>;

  export function provideControlRef(
    control: ItmControl,
    target: Target,
    formRef?: ItmFormRef
  ): ItmControlRef {
    return (
      formRef ? formRef.get(control.key) : new ItmControlRef(control, target.value[control.key])
    );
  }

  export const factory: Area.Factory<ItmControl, Config> = Field.factory.extend({
    selector,
    serializer,
    model: {
      type: null,
      pattern: null,
      required: null,
      min: null,
      max: null,
      enum: null,
      validator: null
    },
    shared: new Area.Shared({
      defaultComp: cfg => cfg.defaultControlComp,
      providers: Map<any, Area.Provider>().set(ItmControlRef, {
        deps: [Area, Target, [new Optional(), ItmFormRef]],
        useFactory: provideControlRef
      })
    })
  });

  export function validateSchema(
    control: AbstractControl, record: ItmControl
  ): Observable<ValidationErrors> {
    const {value} = control;
    if (typeof value === 'undefined' || value === null)
      return of(record.required ? {required: true} : null);
    const {pattern, min, max} = record;
    if (
      pattern instanceof RegExp && !pattern.test(value) ||
      isCollection(pattern) && !pattern.has(value) ||
      (min !== null && max !== null) && !(value >= min && value <= max) ||
      (min !== null) && !(value >= min) ||
      (max !== null) && !(value <= max)
    ) return of({schema: true});
    return record.validator ? record.validator(control) : of(null);
  }
}

export default ItmControl;
