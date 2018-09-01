import { StaticProvider, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { ItmColumnConfig } from './column-config';
import { Itm, ItmPipe, ItmPipeLike, deferPipe, ItmsChanges } from './item';
import { ComponentType, isComponentType } from './utils';

export const ITM_DEFAULT_CELL_VALUE_CHANGES = new InjectionToken('ITM_DEFAULT_CELL_VALUE_CHANGES');

// tslint:disable-next-line:max-line-length
export const ITM_DEFAULT_HEADER_CELL_VALUE_CHANGES = new InjectionToken('ITM_DEFAULT_HEADER_CELL_VALUE_CHANGES');

/** The definition of a column used by ItmTableComponent */
export class ItmColumnDef<I extends Itm = Itm> implements ItmColumnConfig {
  readonly key: string;
  readonly sortable?: true;
  readonly size: number;
  readonly grow: number;
  readonly cell: ComponentType;
  readonly header: ComponentType;

  readonly noCell: boolean;
  readonly noHeaderCell: boolean;
  readonly providers: StaticProvider[] = [];

  constructor(cfg: ItmColumnConfig<I>) {
    if (cfg.key && typeof cfg.key === 'string') this.key = cfg.key;
    else throw new TypeError('InvalidItmColumnConfig : Expected [key] as string for column config');
    if (cfg.sortable === true) this.sortable = true;
    this.size = (cfg.size && typeof cfg.size === 'number') ? cfg.size : 2;
    this.grow = (cfg.grow && typeof cfg.grow === 'number') ? cfg.grow : 0;
    this.cell = isComponentType(cfg.cell) ? cfg.cell as ComponentType : null;
    if (!this.cell && cfg.cell === false) this.noCell = true;
    else if (!this.cell) {
      const cellValuePipe: ItmPipe<I, string> = (
        !cfg.cell ? item => of(item[this.key]) :
        typeof cfg.cell === 'string' ? item => of(item[cfg.cell as string]) :
          deferPipe(cfg.cell as ItmPipeLike<I, string>)
      );
      this.providers.push({
        provide: ITM_DEFAULT_CELL_VALUE_CHANGES,
        deps: [Itm],
        useFactory: cellValuePipe
      });
    }
    this.header = isComponentType(cfg.header) ? cfg.header as ComponentType : null;
    if (!this.header && cfg.header === false) this.noHeaderCell = true;
    else if (!this.header) {
      const headerCellValuePipe: (itemsChanges: ItmsChanges<I>) => Observable<string> = (
        typeof cfg.header === 'string' ? () => of(cfg.header as string) :
        typeof cfg.header === 'function' ?
          itemChanges => {
            const pipe = deferPipe(cfg.header as ItmPipeLike<I[], string>);
            return itemChanges.pipe(flatMap(items => pipe(items)));
          } :
          () => of(this.key)
      );
      this.providers.push({
        provide: ITM_DEFAULT_HEADER_CELL_VALUE_CHANGES,
        deps: [ItmsChanges],
        useFactory: headerCellValuePipe
      });
    }
  }
}
