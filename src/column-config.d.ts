import { Observable } from 'rxjs';

import { Itm, Itms } from './item';
import { ComponentType } from './utils';

/** A plain object used as data for ItmColumnDef. */
export interface ItmColumnData { [key: string]: any; }

/** The definition of a column used by ItmTableConfig. */
export interface ItmColumnConfig<D extends ItmColumnData = ItmColumnData> {
  /** Used by MatTable but also as default value for the attr and the header. */
  key: string;
  /** Used by MatTable. */
  sortable?: true;
  /** The display width of column based on a base 12. */
  size?: number;
  /** The flex behavior of the column. */
  grow?: number;
  /**
   * The component displayed in MatCell.
   * In case of component class, the value is used by the component factory.
   * In case of string, the value is used as the attribute for default cell. */
  cell?: (
    string |
    ComponentType |
    ((item: Itm) => (string | Observable<string>))
  );
  /**
   * The component displayed in MatHeaderCell.
   * In case of component class, the value is used by the component factory.
   * In case of string, the value is used as the attribute for default header cell.
   * In case of false, none header is displayed. */
  header?: (
    string |
    ComponentType |
    ((items: Itms) => (string | Observable<string>)) |
    false
  );
  /** The plain object to access custom data in cell components. */
  data?: D;
}
