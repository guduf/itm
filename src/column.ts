
import { Itm, ItmPipeLike } from './item';
import { ComponentType } from './utils';
import Area from './area';
import RecordFactory from './record-factory';
import { RecordOf } from 'immutable';

/** The definition of a column used by ItmTableConfig. */
interface ItmColumnConfig<I extends Itm = Itm> {
  /** Used by MatTable. */
  sortable?: boolean;
  /**
   * The component displayed in the header.
   * In case of component class, the value is used by the component factory.
   * In case of string, the value is used as the attribute for default header cell.
   * In case of false, none header is displayed. */
  header?: ItmPipeLike<I[], string> | ComponentType | false | Area.Config<I[]>;
}

export module ItmColumn {
  type ModelConfig<I extends Itm = Itm> = ItmColumnConfig<I>;

  export interface Model<I extends Itm = Itm> extends ModelConfig<I> {
    sortable: boolean;
    header: Area.Record<I[]>;
  }

  const serializer = (cfg: ModelConfig, ancestor: Area.Record): Model => {
    if (!Area.factory.isFactoryRecord(ancestor)) throw new TypeError('Expected area record');
    const header: Area.Record = (
      cfg.header === false ? null :
      Area.factory.isFactoryRecord(cfg.header) ? cfg.header as Area.Record :
        Area.factory.serialize(ancestor, (
          typeof cfg.header === 'function' ? {cell: cfg.header} :
          typeof cfg.header === 'object' ? cfg.header :
            {}
        ))
    );
    return {header, sortable: cfg.sortable === true};
  };

  const selector = 'column';

  export type Config<I extends Itm = Itm> = Area.Config<I> & ModelConfig<I>;

  export type Record<I extends Itm = Itm> = Area.Record<I> & RecordOf<Model<I>>;

  export const factory: Area.Factory<Record, Config> = Area.factory.extend({
    selector,
    serializer,
    model: {header: null, sortable: null},
    shared: new Area.Shared({})
  });
}

export default ItmColumn;
