
import { RecordOf } from 'immutable';

import Area from './area';
import { Itm, ItmPipeLike } from './item';
import RecordFactory from './record-factory';

export module ItmField {
  export interface Config<I extends Itm = Itm> {
    label: ItmPipeLike<I, string> | false;
  }

  export interface Model<I extends Itm = Itm> extends ItmField.Config<I> {
    label: ItmPipeLike<I, string>;
  }

  export type Record<I extends Itm = Itm> = RecordOf<Area.Model<I> & ItmField.Model<I>>;

  const selector = 'field';

  const serializer = (cfg: RecordOf<ItmField.Config>, area: Area.Record): ItmField.Model => ({
    label: (
      cfg.label === false ? null :
      cfg.label && ['string', 'function'].includes(typeof cfg.label) ? cfg.label :
      area ? area.key :
        null
    )
  });

  export const factory: RecordFactory<ItmField.Record, ItmField.Config> = RecordFactory.build({
    selector,
    serializer,
    model: {label: null},
    ancestors: [Area.factory]
  });
}

export default ItmField;
