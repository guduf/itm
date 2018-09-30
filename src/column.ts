
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
  export type Config<I extends Itm = Itm> = ItmColumnConfig<I>;

  export interface Model<I extends Itm = Itm> extends ItmColumn.Config<I> {
    sortable: boolean;
    header: Area.Record<I[]>;
  }

  export type Record<I extends Itm = Itm> = RecordOf<Area.Model<I> & ItmColumn.Model<I>>;

  const serializer = (cfg: ItmColumn.Config, ancestor: Area.Record): ItmColumn.Model => {
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

  // tslint:disable-next-line:max-line-length
  export const factory: RecordFactory<ItmColumn.Record, Area.Config & ItmColumn.Config> = RecordFactory.build({
    selector,
    serializer,
    model: {header: null, sortable: false},
    ancestors: [Area.factory]
  });
}

export default ItmColumn;
