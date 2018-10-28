import { Component, Input, OnChanges, SimpleChanges, HostBinding } from '@angular/core';

import Grid from './grid';
import Table from './table';
import { ComponentWithSource } from './utils';

const SELECTOR = 'itm-table';

@Component({
  selector: SELECTOR,
  template: `
    <ng-container *ngIf="tableRecord as table">
      <itm-grid
        [grid]="table.header" [source]="target"
        [ngClass]="headerRowClass"></itm-grid>
      <itm-grid *ngFor="let rowSource of target"
        [grid]="table" [source]="rowSource"
        [ngClass]="rowClass"></itm-grid>
    </ng-container>
  `
})
// tslint:disable-next-line:max-line-length
export class ItmTableComponent<T extends Object = {}> extends ComponentWithSource<T[]> implements OnChanges {
  @Input()
  /** The configuration of the table. */
  table: Grid.Config = null;

  readonly headerRowClass = `${SELECTOR}-header-row`;

  readonly rowClass = `${SELECTOR}-row`;

  @HostBinding('class')
  get hostClass(): string { return SELECTOR; }

  get tableRecord(): Table { return this._table; }

  private _table: Table;

  constructor() {
    super();
  }

  ngOnChanges({table: tableChanges, source: sourceChanges}: SimpleChanges) {
    if (sourceChanges) super.ngOnChanges({source: sourceChanges});
    if (tableChanges) (this._table = Table.factory.serialize(this.table));
  }
}
