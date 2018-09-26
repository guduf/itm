import { ItmColumnConfig, ItmColumn } from './column';
import { Itm, ItmPipeLike } from './item';
import { ItmActionConfig, ItmAction } from './action';

/** The ItmTableComponent is the lowest component used to display tables by this module. */
export class ItmTableConfig<I extends Itm = Itm> {
  /** The actions to attached to the rows */
  rowActions?: ItmActionConfig<I>[];

  /** The columns displayed by the table. */
  columns?: (string | ItmColumnConfig<I>)[] | Map<string, ItmColumnConfig<I>>;

  /** The function returns the CSS class added to the MatRowElement. Default: undefined */
  setRowClass?: ItmPipeLike<I, string>;

  /** The function returns the CSS class added to the MatRowElement. Default: false */
  canSelect?: ItmPipeLike<I, boolean>;

  /** The number limit of items that can be selected. Default: undefined*/
  selectionLimit?: number;
}

export class ItmTable<I extends Itm = Itm> implements ItmTableConfig<I> {
  /** see [[ItmTableConfig.rowActions]] */
  readonly rowActions?: ItmAction<I>[];

  /** see [[ItmTableConfig.columns]] */
  readonly columns?: Map<string, ItmColumn<I>>;

  /** see [[ItmTableConfig.setRowClass]] */
  readonly setRowClass?: ItmPipeLike<I, string>;

  /** see [[ItmTableConfig.canSelect]] */
  readonly canSelect?: ItmPipeLike<I, boolean>;

  /** see [[ItmTableConfig.selectionLimit]] */
  readonly selectionLimit?: number;

  constructor(cfg: ItmTableConfig) { }
}
