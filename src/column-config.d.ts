import { Observable, observable, ObservableLike } from 'rxjs';

import { Itm, ItmPipeLike } from './item';
import { ComponentType } from './utils';
import { StaticProvider } from '@angular/core';

/** The definition of a column used by ItmTableConfig. */
export interface ItmColumnConfig<I extends Itm = Itm> {
  /** Used by MatTable but also as default value for the attr and the header. */
  key: string;

  /** Used by MatTable. */
  sortable?: true;

  /** The flex behavior of the column. */
  grow?: number;

  /**
   * The component displayed in MatCell.
   * In case of component class, the value is used by the component factory.
   * In case of string, the value is used as the attribute for default cell. */
  cell?: ItmPipeLike<I, string> | ComponentType | false;

  /**
   * The component displayed in MatHeaderCell.
   * In case of component class, the value is used by the component factory.
   * In case of string, the value is used as the attribute for default header cell.
   * In case of false, none header is displayed. */
  header?: ItmPipeLike<I[], string> | ComponentType | false;

  /** The plain object to access custom data in cell components. */
  providers?: StaticProvider[];

  /** The size of column based on 24 slots for the viewport width. Default: 2 */
  size?: number;
}
