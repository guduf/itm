import { Observable } from 'rxjs';

import { Itms, Itm } from './item';
import { ItmColumnData, ItmColumnConfig } from './column-config';
import { ComponentType, isComponentType } from './utils';

/** Data for the injected ItmColumnDef for ItmDefaultCellComponent. */
export interface ItmDefaultColumnData<I extends Itm = Itm> {
  setValueChanges: ((item: I) => (string | Observable<string>));
}

/** Data for the injected ItmColumnDef for ItmDefaultHeaderCellComponent. */
export interface ItmDefaultHeaderColumnData<I extends Itm = Itm> extends ItmColumnData {
  setHeadingChanges: ((items: Itms<I>) => (string | Observable<string>));
}

/** The definition of a column used by ItmTableComponent */
export class ItmColumnDef<D extends ItmColumnData = ItmColumnData> implements ItmColumnConfig<D> {
  readonly key: string;
  readonly sortable?: true;
  readonly size: number;
  readonly grow: number;
  readonly cell: ComponentType;
  readonly header: ComponentType;
  readonly data: D;

  constructor(cfg: ItmColumnConfig) {
    if (cfg.key && typeof cfg.key === 'string') this.key = cfg.key;
    else throw new TypeError('InvalidItmColumnConfig : Expected [key] as string for column config');
    if (cfg.sortable === true) this.sortable = true;
    this.size = (cfg.size && typeof cfg.size === 'number') ? cfg.size : 1;
    this.grow = (cfg.grow && typeof cfg.grow === 'number') ? cfg.grow : 0;
    this.cell = isComponentType(cfg.cell) ? cfg.cell as ComponentType : null;
    if (!this.cell) {
      const setValueChanges: (item: Itm) => (string | Observable<string>) = (
        typeof cfg.cell === 'function' ? cfg.cell as (item: Itm) => (string | Observable<string>) :
        typeof cfg.cell === 'string' ? itm => itm[cfg.cell as string] :
          itm => itm[this.key]
      );
      // WORKAROUND remove any type
      (this.data as any) = {...(this.data as any), setValueChanges} as ItmDefaultColumnData;
    }
    this.header = isComponentType(cfg.header) ? cfg.header as ComponentType : null;
    if (!this.header) {
      const setHeadingChanges: (items: Itms) => (string | Observable<string>) = (
        (cfg.header as false) === false ? null :
        // tslint:disable-next-line:max-line-length
        typeof cfg.header === 'function' ? cfg.header as (items: Itms) => (string | Observable<string>) :
        typeof cfg.header === 'string' ? () => cfg.header as string :
          () => this.key
      );
      // WORKAROUND remove any type
      (this.data as any) = {...(this.data as any), setHeadingChanges} as ItmDefaultHeaderColumnData;
    }
  }
}
