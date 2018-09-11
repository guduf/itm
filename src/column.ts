
import { Itm, ItmPipe, ItmPipeLike, ItmsChanges, deferPipe } from './item';
import { ItmAreaDef } from './area-def';
import { ItmAreaConfig } from './area-config';
import { ComponentType } from './utils';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

/** The definition of a column used by ItmTableConfig. */
export interface ItmColumnConfig<I extends Itm = Itm> extends ItmAreaConfig<I> {
  /** Used by MatTable. */
  sortable?: boolean;
}

/** The definition of a column used by ItmTableComponent */
// tslint:disable-next-line:max-line-length
export class ItmColumnDef<I extends Itm = Itm> extends ItmAreaDef<I> implements ItmColumnConfig {
  /** Whether the column is sortable. */
  readonly sortable: boolean;

  constructor(cfg: ItmColumnConfig<I>) {
    super(cfg);
    if (cfg.sortable === true) this.sortable = true;
  }
}
