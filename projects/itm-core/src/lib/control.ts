import { AbstractControl } from '@angular/forms';
import { Collection, RecordOf } from 'immutable';

import ControlRef from './control_ref';
import Field from './field';
import Target from './target';

export type ItmControl<T extends Object = {}> = Field<T> & RecordOf<ItmControl.Model>;

export module ItmControl {
  export enum Type {
    number = 'number',
    string = 'string'
  }

  export interface ModelConfig {
    type?: Type;
    pattern?: RegExp;
    required?: boolean;
    min?: number;
    max?: number;
    enum?: Collection<any, any>;
    validator?: Target.PipeLike<AbstractControl, ControlRef.Validation>;
  }

  export interface Model extends ModelConfig {
    type: Type;
    pattern: RegExp | null;
    required: boolean;
    min: number | null;
    max: number | null;
    enum: Collection<any, any> | null;
    validator: Target.Pipe<AbstractControl, ControlRef.Validation> | null;
  }

  export type Config<T extends Object = {}> = Field.Config<T> &  ModelConfig;

  export const selector = 'control';
}

export default ItmControl;
