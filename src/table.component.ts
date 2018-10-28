import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import Grid from './grid';
import Table from './table';
import { ComponentWithSource } from './utils';

@Component({
  selector: 'itm-table',
  template: `
    <ng-container *ngIf="tableRecord as table">
      <itm-grid [grid]="table.header" [source]="target"></itm-grid>
      <itm-grid *ngFor="let rowSource of target" [grid]="table" [source]="rowSource"></itm-grid>
    </ng-container>
  `
})
// tslint:disable-next-line:max-line-length
export class ItmTableComponent<T extends Object = {}> extends ComponentWithSource<T[]> implements OnChanges {
  @Input()
  /** The configuration of the table. */
  table: Grid.Config = null;

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
