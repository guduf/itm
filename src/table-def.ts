import { of } from 'rxjs';

import { ItmAction } from './action';
import { ItmColumn } from './column';
import { Itm, ItmPipe, deferPipe } from './item';
import { ItmTableConfig } from './table-config';

export class ItmTableDef<I extends Itm = Itm> implements ItmTableConfig {
  /** see [[ItmTableConfig.rowActions]] **/
  rowActions: ItmAction<I>[];

  /** see [[ItmTableConfig.columns]] **/
  columns: Map<string, ItmColumn>;

  /** see [[ItmTableConfig.setRowClass]] **/
  setRowClass: ItmPipe<I, string>;

  /** see [[ItmTableConfig.canSelect]] **/
  canSelect: ItmPipe<I, boolean>;

  /** see [[ItmTableConfig.selectionLimit]] **/
  selectionLimit: number;

  constructor(cfg: ItmTableConfig<I> = {}) {
    this.rowActions = (
      !Array.isArray(cfg.rowActions) ? [] :
        cfg.rowActions.map(actionCfg => new ItmAction<I>(actionCfg))
    );
    cfg.columns = (
      Array.isArray(cfg.columns) ? cfg.columns :
      cfg.columns instanceof Map ? Array.from(cfg.columns.values()) :
      []
    );
    const columns = new Map<string, ItmColumn<I>>();
    for (const columnCfg of cfg.columns) {
      const columnDef = new ItmColumn(
        typeof columnCfg === 'string' ? {key: columnCfg} : columnCfg
      );
      columns.set(columnDef.key, columnDef);
    }
    this.columns = columns;
    this.canSelect = (
      typeof cfg.canSelect === 'function' ? deferPipe(cfg.canSelect) :
      cfg.canSelect === true ? () => of(true) :
        null
    );
    this.setRowClass = typeof cfg.setRowClass === 'function' ? deferPipe(cfg.setRowClass) : null;
    this.selectionLimit = cfg.selectionLimit > 0 ? Math.round(cfg.selectionLimit) : 0;
  }
}
