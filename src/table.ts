import { Set, RecordOf } from 'immutable';

import Action from './action';
import Column from './column';
import { deferPipe, Itm, ItmPipe, ItmPipeLike } from './item';
import RecordFactory from './record-factory';

interface ItmTableConfig<I extends Itm = Itm> {
  /** The actions to attached to the rows */
  rowActions?: Action.Config<I>[] | Set<Action.Config<I>>;

  /** The columns displayed by the table. */
  columns?: Column.Config<I>[] | Set<Column.Config<I>>;

  /** The function returns the CSS class added to the MatRowElement. Default: undefined */
  setRowClass?: ItmPipeLike<I, string>;

  /** The function returns the CSS class added to the MatRowElement. Default: false */
  canSelect?: ItmPipeLike<I, boolean>;

  /** The number limit of items that can be selected. Default: undefined*/
  selectionLimit?: number;
}

export type ItmTable<I extends Itm = Itm> = RecordOf<ItmTable.Model<I>>;

export module ItmTable {
  export type Config<I extends Itm = Itm> = ItmTableConfig<I>;

  export interface Model<I extends Itm = Itm> extends Config<I> {
    rowActions: Set<Action<I>>;
    columns: Set<Column>;
    setRowClass: ItmPipe<I, string>;
    canSelect: boolean | ItmPipe<I, boolean>;
    selectionLimit: number;
  }

  const serializer = (cfg: RecordOf<Config>): Model => {
    const rowActions = Set(cfg.rowActions).map(actionCfg => Action.factory.serialize(actionCfg));
    const columns = Set(cfg.columns).map(colCfg => Column.factory.serialize(colCfg));
    const canSelect = (
      typeof cfg.canSelect === 'function' ? deferPipe(cfg.canSelect) : cfg.canSelect === true
    );
    const setRowClass = typeof cfg.setRowClass === 'function' ? deferPipe(cfg.setRowClass) : null;
    const selectionLimit = cfg.selectionLimit > 0 ? Math.round(cfg.selectionLimit) : 0;
    return {columns, canSelect, setRowClass, selectionLimit, rowActions};
  };

  const selector = 'table';

  export const factory: RecordFactory<ItmTable, Config> = RecordFactory.build({
    selector,
    serializer,
    model: {
      columns: null,
      canSelect: null,
      setRowClass: null,
      selectionLimit: null,
      rowActions: null
    }
  });
}

export default ItmTable;
