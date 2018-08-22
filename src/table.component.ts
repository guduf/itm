import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';

import { Itm, ItmsChanges } from './itm';
import { ItmTable } from './table';
import { ItmColumn, ItmColumnDef } from './column';

@Component({
  selector: 'itm-table',
  templateUrl: './table.component.html'
})
export class ItmTableComponent<I extends Itm = Itm> implements OnChanges {
  @Input()
  /** The value is used as data source for MatTable. */
  itemsChanges: ItmsChanges<I>;

  columns: ItmColumnDef[];

  displayedColumns: string[];

  @Input()
  table: ItmTable;

  ngOnChanges({table: tableChanges}: SimpleChanges) {
    if (!tableChanges) return;
    this.columns = this.table.columns.map(def => new ItmColumn(
      typeof def === 'string' ? {key: def} : def
    ));
    this.displayedColumns = this.columns.map(({key}) => key);
    console.log(this);
  }
}
