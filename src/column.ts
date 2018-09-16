
import { Itm } from './item';
import { ItmPropAreaDef } from './area-def';
import { ItmPropAreaConfig } from './area-config';

/** The definition of a column used by ItmTableConfig. */
export interface ItmColumnConfig<I extends Itm = Itm> extends ItmPropAreaConfig<I> {
  /** Used by MatTable. */
  sortable?: boolean;
}

/** The definition of a column used by ItmTableComponent */
// tslint:disable-next-line:max-line-length
export class ItmColumnDef<I extends Itm = Itm> extends ItmPropAreaDef<I> implements ItmColumnConfig {
  /** Whether the column is sortable. */
  readonly sortable: boolean;

  constructor(cfg: ItmColumnConfig<I>) {
    super(cfg);
    if (cfg.sortable === true) this.sortable = true;
  }
}
