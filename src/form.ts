import { Map, RecordOf } from 'immutable';

import Area from './area';
import Control from './control';
import { ItmControlComponent } from './control.component';
import Card from './grid';
import { Itm } from './item';
import RecordFactory from './record-factory';

export module ItmForm {
  interface ModelConfig<I extends Itm = Itm> {
    controls?: Area.Configs<Control.Config<I>>;
  }

  export type Config<I extends Itm = Itm> = Card.Config<I> & ModelConfig<I>;

  export interface Model<I extends Itm = Itm> extends ModelConfig<I> {
    defaultSelector: string;
    areas: Map<string, Map<string, Area.Record<I>>>;
    controls: Map<string, Control.Record<I>>;
  }

  export type Record<I extends Itm = Itm> = Card.Record<I> & RecordOf<Model<I>>;

  const serializer = (cfg: ModelConfig): Model => {
    const defaultSelector = 'control';
    const controls = Area.serializeAreas(cfg.controls, Control.factory)
    .map(control => control.cell ? control : control.set('cell', ItmControlComponent));
    return {areas: Map({[Control.selector]: controls}), defaultSelector, controls};
  };

  export const selector = 'form';

  export const factory: RecordFactory<Record, Config> = RecordFactory.build({
    selector,
    serializer,
    model: {areas: null, defaultSelector: null, controls: null},
    ancestors: [Card.factory]
  });
}

export default ItmForm;
