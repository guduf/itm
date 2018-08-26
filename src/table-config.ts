import { ItmColumnConfig } from './column-config';
import { Itm, ItmValueSoftPipe } from './item';

/** The ItmTableComponent is the lowest component used to display tables by this module. */
export class ItmTableConfig<I extends Itm = Itm> {
  /** The columns displayed by the table. */
  columns: (string | ItmColumnConfig)[];

  /** The anchor target attribute. Default: 'blank'*/
  linkTarget?: 'self' | 'blank';

  /** The function returns the CSS class added to the MatRowElement. Default: undefined */
  setRowClass?: ItmValueSoftPipe<string>;

  /** The function returns the CSS class added to the MatRowElement. Default: false */
  canSelect?: boolean | ItmValueSoftPipe<boolean>;

  /** The number limit of items that can be selected. Default: undefined*/
  selectionLimit?: number;
}
