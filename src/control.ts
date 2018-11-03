import { Optional } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Map, RecordOf, Collection, isCollection } from 'immutable';

import Area from './area';
import ControlRef from './control_ref';
import FormRef from './form_ref';
import Field from './field';
import Target from './target';
import { isEnumIncludes } from './utils';

export type ItmControl<T extends Object = {}> = Field<T> & RecordOf<ItmControl.Model<T>>;

export module ItmControl {
  export enum Type {
    number = 'number',
    string = 'string'
  }

  export interface ModelConfig<T extends Object = {}> {
    type?: Type;
    pattern?: RegExp;
    required?: boolean;
    min?: number;
    max?: number;
    enum?: Collection<any, any>;
    validator?: Target.PipeLike<AbstractControl, ControlRef.Validation>;
  }

  export interface Model<T extends Object = {}> extends ModelConfig<T> {
    type: Type;
    pattern: RegExp | null;
    required: boolean;
    min: number | null;
    max: number | null;
    enum: Collection<any, any> | null;
    validator: Target.Pipe<AbstractControl, ControlRef.Validation> | null;
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
      providers: Map<any, Area.Provider>().set(ControlRef, {
        deps: [Area, Target, [new Optional(), FormRef]],
        useFactory: ControlRef.provide
      })
    })
  });
}

export default ItmControl;
