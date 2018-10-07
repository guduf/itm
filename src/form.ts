import Field from './area';
import RecordFactory from './record-factory';
import { RecordOf } from 'immutable';
import { Itm } from './item';

export module ItmControl {
  export interface Model {
    required: boolean;
    pattern: RegExp;
  }

  export type Config = Partial<Model>;

  export type Record<I extends Itm = Itm> = RecordOf<Field.Model<I> & Model>;

  const selector = 'control';

  const serializer = (cfg: RecordOf<Config>): Model => {
    if (cfg.required !== null && typeof cfg.required !== 'boolean')
      throw new TypeError('Expected optionnal boolean');
    const required = cfg.required === true;
    if (cfg.pattern !== null && !(cfg.pattern instanceof RegExp))
      throw new TypeError('Expected optionnal RegExp');
    const pattern = cfg.pattern;
    return {required, pattern};
  };

  export const factory: RecordFactory<Record, Config> = RecordFactory.build({
    selector,
    serializer,
    model: {required: null, pattern: null},
    ancestors: [Field.factory]
  });
}
