import { Observable, observable, ObservableLike } from 'rxjs';

import { Itm, ItmPipeLike } from './item';
import { ComponentType } from './utils';
import { StaticProvider } from '@angular/core';

/** The config to define a display container for a item property. */
export interface ItmAreaConfig<T = {}> {
  /** The key of the item property. */
  key: string;

  /** The flex behavior of the container. */
  grow?: number;

  /**
   * The component displayed in the container.
   * In case of component class, the value is used by the component factory.
   * In case of string, the value is used as the attribute for default cell. */
  cell?: ItmPipeLike<T, string> | ComponentType | false;

  /** The plain object to access custom data in cell components. */
  providers?: StaticProvider[];

  /** The size of column based on 24 slots for the viewport width. Default: 2 */
  size?: number;
}

/** The config to define a display container for a item property. */
export interface ItmPropAreaConfig<I extends Itm = Itm> extends ItmAreaConfig<I> {
  /** The key of the item property. */
  key: string & keyof I;

  /** The flex behavior of the container. */
  grow?: number;

  /**
   * The component displayed in the header.
   * In case of component class, the value is used by the component factory.
   * In case of string, the value is used as the attribute for default header cell.
   * In case of false, none header is displayed. */
  header?: ItmPipeLike<I[], string> | ComponentType | false;

  /**
   * The component displayed in the label.
   * In case of component class, the value is used by the component factory.
   * In case of string, the value is used as the attribute for default header cell.
   * In case of false, none header is displayed. */
  label?: ItmPipeLike<I, string> | ComponentType | false;
}

