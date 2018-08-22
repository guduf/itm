import { Itm } from './itm';
import { ItmColumnDef } from './column';

/** The ItmTableComponent is the lowest component used to display tables by this module. */
export class ItmTable<I extends Itm = Itm> {
  /** The columns displayed by the table. */
  columns: (string | ItmColumnDef)[];

  /** The anchor target attribute. */
  linkTarget?: 'self' | 'blank';

  /** The function returns the CSS class added to the MatRowElement. */
  setRowClass?: ((item: I) => string);
}
