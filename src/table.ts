import { Itm } from './itm';
import { ItmColumnConfig } from './column-config';

/** The ItmTableComponent is the lowest component used to display tables by this module. */
export class ItmTableConfig<I extends Itm = Itm> {
  /** The columns displayed by the table. */
  columns: (string | ItmColumnConfig)[];

  /** The anchor target attribute. */
  linkTarget?: 'self' | 'blank';

  /** The function returns the CSS class added to the MatRowElement. */
  setRowClass?: ((item: I) => string);
}
