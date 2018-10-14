
import { RecordOf } from 'immutable';

import Area from './area';
import { Itm, ItmPipeLike } from './item';
import { ItmFieldComponent } from './field.component';

export type ItmField<I extends Itm = Itm> = Area<I> & RecordOf<ItmField.Model<I>>;

export module ItmField {
  export interface ModelConfig<I extends Itm = Itm> {
    label?: ItmPipeLike<I, string> | false;
  }

  export interface Model<I extends Itm = Itm> extends ModelConfig<I> {
    label: ItmPipeLike<I, string> | false;
  }

  const serializer = (cfg: RecordOf<ModelConfig>, area: Area): Model => {
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

  export const factory: Area.Factory<ItmField, Config> = Area.factory.extend({
    selector,
    serializer,
    model: {label: null},
    shared: new Area.Shared({defaultComp: ItmFieldComponent})
  });
}

export default ItmField;
