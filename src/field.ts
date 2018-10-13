
import { RecordOf } from 'immutable';

import Area from './area';
import { Itm, ItmPipeLike } from './item';
import { ItmFieldComponent } from './field.component';

export module ItmField {
  export interface ModelConfig<I extends Itm = Itm> {
    label?: ItmPipeLike<I, string> | false;
  }

  export interface Model<I extends Itm = Itm> extends ModelConfig<I> {
    label: ItmPipeLike<I, string> | false;
  }

  const serializer = (cfg: RecordOf<ModelConfig>, area: Area.Record): Model => {
    const label = (
      cfg.label === false ? null :
      cfg.label && ['string', 'function'].includes(typeof cfg.label) ? cfg.label :
      area ? area.key :
        null
    );
    return {label};
  };

  export const selector = 'field';

  export type Config<I extends Itm = Itm> = Area.Config<I> & ModelConfig<I>;

  export type Record<I extends Itm = Itm> = Area.Record<I> & RecordOf<Model<I>>;

  export const factory: Area.Factory<Record, Config> = Area.factory.extend({
    selector,
    serializer,
    model: {label: null},
    shared: new Area.Shared({defaultComp: ItmFieldComponent})
  });
}

export default ItmField;
