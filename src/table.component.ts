import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';

import { Itm, ItmsChanges } from './itm';
import { ItmTable } from './table';
import { ItmColumn, ItmColumnDef } from './column';

@Component({
  selector: 'itm-table',
  templateUrl: './table.component.html'
})
/**
 * Exported component to display ItmTable
 */
export class ItmTableComponent<I extends Itm = Itm> implements OnChanges {
  @Input()
  /** Data source for MatTable and provider for ItmHeaderCellComponent. */
  itemsChanges: ItmsChanges<I>;

  @Input()
  /** The table definition to configure the MatTable */
  table: ItmTable;

  /** The columns transcluded to the MatTable */
  columns: ItmColumn[];

  /** The keys of the columns to display */
  displayedColumns: string[];

  ngOnChanges({table: tableChanges}: SimpleChanges) {
    if (!tableChanges) return;
    this.columns = this.table.columns.map(def => new ItmColumn(
      typeof def === 'string' ? {key: def} : def
    ));
    this.displayedColumns = this.columns.map(({key}) => key);
  }
}
