import { AbstractControl } from '@angular/forms';
import { RecordOf } from 'immutable';

import ControlRef from './control_ref';
import Field from './field';
import Target from './target';
import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';

// tslint:disable-next-line:max-line-length
export type ItmControl<T extends Object = {}> = (
  Field<T> & RecordOf<ItmControl.Model>
);

export module ItmControl {
  export interface Schema extends JSONSchema7 {
    type: JSONSchema7TypeName;
  }

  export interface ModelConfig {
    required?: boolean;
    schema?: Schema;
    validator?: Target.PipeLike<AbstractControl, ControlRef.Validation>;
  }

  export interface Model extends ModelConfig {
    required: boolean;
    schema: Schema;
    validator: Target.Pipe<AbstractControl, ControlRef.Validation> | null;
  }

  export type Config<T extends Object = {}> = (
    Field.Config<T> &  ModelConfig
  );

  export const selector = 'control';
}

export default ItmControl;
