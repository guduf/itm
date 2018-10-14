import { InjectionToken } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Map, RecordOf } from 'immutable';

import Area from './area';
import Field from './field';
import { Itm } from './item';
import { ItmControlComponent } from './control.component';

export type ItmControl<I extends Itm = Itm> = Field<I> & RecordOf<ItmControl.Model<I>>;

export module ItmControl {
  export type Type = 'string' | 'number';

  export const TYPES: Type[] = ['string', 'number'];

  export interface ModelConfig<I extends Itm = Itm> {
    type?: Type;
    pattern?: RegExp;
    required?: boolean;
  }

  export interface Model<I extends Itm = Itm> extends ModelConfig<I> {
    type: Type;
    pattern: RegExp;
    required: boolean;
  }

  const serializer = (cfg: ModelConfig): Model => {
    if (cfg.type && !TYPES.includes(cfg.type)) throw new TypeError('Expected control type');
    return {
      type: cfg.type || 'string',
      pattern: cfg.pattern instanceof RegExp ? cfg.pattern : null,
      required: typeof cfg.required === 'boolean' ? cfg.required : false
    };
  };

  export const selector = 'control';

  export type Config<I extends Itm = Itm> = Field.Config<I> & ModelConfig<I>;

  export const ABSTRACT_CONTROL_TOKEN = new InjectionToken<AbstractControl>('ITM_ABSTRACT_CONTROL');

  export const factory: Area.Factory<ItmControl, Config> = Field.factory.extend({
    selector,
    serializer,
    model: {type: null, pattern: null, required: null},
    shared: new Area.Shared({
      defaultComp: ItmControlComponent,
      provide: (record: ItmControl, target: Itm) => (
        Map<InjectionToken<any>, any>()
          .set(ABSTRACT_CONTROL_TOKEN, buildFormControl(record, target))
      )
    })
  });

  export function buildFormControl<I extends Itm = Itm>(
    record: ItmControl<I>,
    target: I
  ): AbstractControl {
    return new FormControl(target[record.key]);
  }
}

export default ItmControl;
