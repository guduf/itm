import { Optional } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Map, RecordOf } from 'immutable';

import Area from './area';
import Field from './field';
import Target from './target';
import { isEnumIncludes } from './utils';

export abstract class NgForm extends FormGroup { }

export abstract class NgControl extends AbstractControl { }

export type ItmControl<T extends Object = {}> = Field<T> & RecordOf<ItmControl.Model<T>>;

export module ItmControl {
  export interface ModelConfig<T extends Object = {}> {
    type?: Type;
    pattern?: RegExp;
    required?: boolean;
  }

  export interface Model<T extends Object = {}> extends ModelConfig<T> {
    type: Type;
    pattern: RegExp;
    required: boolean;
  }

  export enum Type {
    number = 'number',
    string = 'string'
  }

  const serializer = (cfg: ModelConfig): Model => {
    if (cfg.type && !isEnumIncludes(Type, cfg.type)) throw new TypeError('Expected control type');
    return {
      type: cfg.type || Type.string,
      pattern: cfg.pattern instanceof RegExp ? cfg.pattern : null,
      required: typeof cfg.required === 'boolean' ? cfg.required : false
    };
  };

  export const selector = 'control';

  export type Config<T extends Object = {}> = Field.Config<T> & ModelConfig<T>;

  const ngControlProvider: Area.Provider = {
    deps: [Area, Target, [new Optional(), NgForm]],
    useFactory: (area: Area, target: Target, ngForm?: NgForm): NgControl => (
      ngForm ? ngForm.get(area.key) : new FormControl(target.value[area.key])
    )
  };

  export const factory: Area.Factory<ItmControl, Config> = Field.factory.extend({
    selector,
    serializer,
    model: {type: null, pattern: null, required: null},
    shared: new Area.Shared({
      defaultComp: cfg => cfg.defaultControlComp,
      providers: Map<any, Area.Provider>().set(NgControl, ngControlProvider)
    })
  });
}

export default ItmControl;
