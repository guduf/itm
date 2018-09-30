import { Set } from 'immutable';

import { ItmAction, ItmActionConfig } from './action';
import Column from './column';
import { Itm, ItmPipe, deferPipe } from './item';
import { ItmTableConfig } from './table-config';

export class ItmTableDef<I extends Itm = Itm> implements ItmTableConfig {
  /** see [[ItmTableConfig.rowActions]] */
  readonly rowActions: Set<ItmAction<I>>;

  /** see [[ItmTableConfig.columns]] */
  readonly columns: Set<Column.Record>;

  /** see [[ItmTableConfig.setRowClass]] */
  readonly setRowClass: ItmPipe<I, string>;

  /** see [[ItmTableConfig.canSelect]] */
  readonly canSelect: boolean | ItmPipe<I, boolean>;

  /** see [[ItmTableConfig.selectionLimit]] */
  readonly selectionLimit: number;

  constructor(cfg: ItmTableConfig<I> = {}) {
    // this.rowActions = parseSet<ItmAction, string | ItmActionConfig>(cfg.rowActions, ItmAction);
    this.columns = Set(cfg.columns).map(colCfg => Column.factory.serialize(colCfg));
    this.canSelect = (
      typeof cfg.canSelect === 'function' ? deferPipe(cfg.canSelect) : cfg.canSelect === true
    );
    this.setRowClass = typeof cfg.setRowClass === 'function' ? deferPipe(cfg.setRowClass) : null;
    this.selectionLimit = cfg.selectionLimit > 0 ? Math.round(cfg.selectionLimit) : 0;
    Object.freeze(this);
  }
}
