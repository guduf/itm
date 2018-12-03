import { AbstractControl } from '@angular/forms';
import { RecordOf } from 'immutable';

import ControlRef from './control_ref';
import Field from './field';
import Target from './target';
import { JSONSchema7 } from 'json-schema';

// tslint:disable-next-line:max-line-length
export type ItmControl<T extends Object = {}, K extends ItmControl.Type = ItmControl.Type.string> = (
  Field<T> & RecordOf<ItmControl.Model<K>>
);

export module ItmControl {
  export enum Type {
    number = 'number',
    string = 'string'
  }

  export type Schema<K extends Type = any> = JSONSchema7 & { type: K };

  export interface ModelConfig<K extends Type = any> {
    type?: ItmControl.Type;
    required?: boolean;
    schema?: Schema<K>;
    validator?: Target.PipeLike<AbstractControl, ControlRef.Validation>;
  }

  export interface Model<K extends Type = any> extends ModelConfig<K> {
    type: ItmControl.Type;
    required: boolean;
    schema: Schema<K>;
    validator: Target.Pipe<AbstractControl, ControlRef.Validation> | null;
  }

  export type Config<T extends Object = {}, K extends Type = any> = (
    Field.Config<T> &  ModelConfig<K>
  );

  export const selector = 'control';
}

export default ItmControl;
