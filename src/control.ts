import { Map, RecordOf } from 'immutable';

import Area from './area';
import Field from './field';
import { Itm } from './item';
import { ItmControlComponent } from './control.component';

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

  export type Record<I extends Itm = Itm> = Field.Record<I> & RecordOf<Model<I>>;

  export const factory: Area.Factory<Record, Config> = Field.factory.extend({
    selector,
    serializer,
    model: {type: null, pattern: null, required: null},
    shared: new Area.Shared({defaultCell: ItmControlComponent})
  });
}

export default ItmControl;
