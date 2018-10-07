import { ItmAreaConfig } from './area-config';
import { ItmArea } from './area';

export interface ItmControlConfig<T = {}> extends ItmAreaConfig<T> {
  pattern?: RegExp;
  required?: boolean;
}

// tslint:disable-next-line:max-line-length
// export class ItmControlDef<T = {}> extends ItmArea<T> implements ItmControlConfig<T> {
//   readonly pattern: RegExp;
//   readonly required: boolean;

//   constructor(cfg: ItmControlConfig<T>) {
//     super(cfg);
//     this.pattern = cfg.pattern instanceof RegExp ? cfg.pattern : null;
//     this.required = typeof cfg.required === 'boolean' ? cfg.required : false;
//   }
// }


import { RecordOf } from 'immutable';

import Field from './field';
import { Itm } from './item';
import RecordFactory from './record-factory';

export module ItmControl {
  export interface ModelConfig<I extends Itm = Itm> {
    pattern?: RegExp;
    required?: boolean;
  }

  export interface Model<I extends Itm = Itm> extends ModelConfig<I> {
    pattern: RegExp;
    required: boolean;
  }

  const serializer = (cfg: ModelConfig): Model => ({
    pattern: cfg.pattern instanceof RegExp ? cfg.pattern : null,
    required: typeof cfg.required === 'boolean' ? cfg.required : false
  });

  const selector = 'field';

  export type Config<I extends Itm = Itm> = Field.Config<I> & ModelConfig<I>;

  export type Record<I extends Itm = Itm> = Field.Record<I> & RecordOf<Model<I>>;

  export const factory: RecordFactory<Record, Config> = RecordFactory.build({
    selector,
    serializer,
    model: {pattern: null, required: null},
    ancestors: [Field.factory]
  });
}
