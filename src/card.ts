import { Map, RecordOf } from 'immutable';

import Area from './area';
import Field from './field';
import Grid from './grid';
import { Itm } from './item';
import RecordFactory from './record-factory';
import { ItmFieldComponent } from './field.component';
import { ComponentType } from './utils';

export module ItmCard {
  interface ModelConfig<I extends Itm = Itm> {
    fields?: Area.Configs<Field.Config<I>>;
  }

  export type Config<I extends Itm = Itm> = Grid.Config<I> & ModelConfig<I>;

  export interface Model<I extends Itm = Itm> extends ModelConfig<I> {
    defaultCell: ComponentType;
    defaultSelector: string;
    areas: Map<string, Map<string, Area.Record<I>>>;
    fields: Map<string, Field.Record<I>>;
  }

  export type Record<I extends Itm = Itm> = Grid.Record<I> & RecordOf<Model<I>>;

  const serializer = (cfg: ModelConfig): Model => {
    const defaultCell = ItmFieldComponent;
    const defaultSelector = 'field';
    const fields = Area.serializeAreas(cfg.fields, Field.factory)
      .map(field => field.cell ? field : field.set('cell', ItmFieldComponent));
    return {areas: Map({[Field.selector]: fields}), defaultCell, defaultSelector, fields};
  };

  export const selector = 'card';

  export const factory: RecordFactory<Record, Config> = RecordFactory.build({
    selector,
    serializer,
    model: {areas: null, defaultCell: null, defaultSelector: null, fields: null},
    ancestors: [Grid.factory]
  });
}

export default ItmCard;
