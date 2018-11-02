import { Component, Input, OnChanges, SimpleChanges, HostBinding } from '@angular/core';

import Grid from './grid';
import Table from './table';

const SELECTOR = 'itm-table';

@Component({
  selector: SELECTOR,
  template: `
    <ng-container *ngIf="tableRecord as table">
      <itm-grid
        [grid]="table.header" [target]="target"
        [ngClass]="headerRowClass"></itm-grid>
      <itm-grid *ngFor="let rowTarget of target"
        [grid]="table" [target]="rowTarget"
        [ngClass]="rowClass"></itm-grid>
    </ng-container>
  `
})
// tslint:disable-next-line:max-line-length
export class ItmTableComponent<T extends Object = {}> implements OnChanges {
  @Input()
  /** The configuration of the table. */
  table: Grid.Config;

  @Input()
  /** The target of the table. */
  target: T[];

  readonly headerRowClass = `${SELECTOR}-header-row`;

  readonly rowClass = `${SELECTOR}-row`;

  @HostBinding('class')
  get hostClass(): string { return SELECTOR; }

  get tableRecord(): Table { return this._table; }

  private _table: Table;

  ngOnChanges({table: tableChanges}: SimpleChanges) {
    if (tableChanges) (this._table = Table.factory.serialize(this.table));
  }
}
