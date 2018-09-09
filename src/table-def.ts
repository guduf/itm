import { of } from 'rxjs';

import { ItmActionDef } from './action';
import { ItmColumnDef } from './column';
import { Itm, ItmPipe, deferPipe } from './item';
import { ItmTableConfig } from './table-config';

export class ItmTableDef<I extends Itm = Itm> implements ItmTableConfig {
  /** see [[ItmTableConfig.rowActions]] **/
  rowActions: ItmActionDef<I>[];

  /** see [[ItmTableConfig.columns]] **/
  columns: Map<string, ItmColumnDef>;

  /** see [[ItmTableConfig.setRowClass]] **/
  setRowClass: ItmPipe<I, string>;

  /** see [[ItmTableConfig.canSelect]] **/
  canSelect: ItmPipe<I, boolean>;

  /** see [[ItmTableConfig.selectionLimit]] **/
  selectionLimit: number;

  constructor(cfg: ItmTableConfig<I> = {}) {
    this.rowActions = (
      !Array.isArray(cfg.rowActions) ? [] :
        cfg.rowActions.map(actionCfg => new ItmActionDef<I>(actionCfg))
    );
    cfg.columns = (
      Array.isArray(cfg.columns) ? cfg.columns :
      cfg.columns instanceof Map ? Array.from(cfg.columns.values()) :
      []
    );
    const columns = new Map<string, ItmColumnDef<I>>();
    for (const columnCfg of cfg.columns) {
      const columnDef = new ItmColumnDef(
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
