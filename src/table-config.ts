import { ItmColumnConfig } from './column-config';
import { Itm, ItmPipeLike } from './item';
import { ItmActionConfig } from './action';

/** The ItmTableComponent is the lowest component used to display tables by this module. */
export class ItmTableConfig<I extends Itm = Itm> {
  /** The actions to attached to the rows */
  actions?: ItmActionConfig[];

  /** The columns displayed by the table. */
  columns: (string | ItmColumnConfig)[];

  /** The function returns the CSS class added to the MatRowElement. Default: undefined */
  setRowClass?: ItmPipeLike<I, string>;

  /** The function returns the CSS class added to the MatRowElement. Default: false */
  canSelect?: ItmPipeLike<I, boolean>;

  /** The number limit of items that can be selected. Default: undefined*/
  selectionLimit?: number;
}
