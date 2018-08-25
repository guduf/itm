// tslint:disable-next-line:max-line-length
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ItmColumnDef } from './column-def';
import { Itm, Itms, ItmsChanges } from './itm';
import { ItmTableConfig } from './table-config';

@Component({
  selector: 'itm-table',
  templateUrl: './table.component.html'
})
/**
 * Exported component to display ItmTableConfig
 */
export class ItmTableComponent<I extends Itm = Itm> implements OnChanges, OnDestroy {
  @Input()
  /** Data source for MatTable and provider for ItmHeaderCellComponent. */
  itemsChanges: ItmsChanges<I>;

  @Input()
  /** The table definition to configure the MatTable */
  table: ItmTableConfig<I>;

  @Input()
  /** The color of the material components inside the table */
  color: string;

  @Output()
  /** Emits selected items changes */
  selectionChanges = new EventEmitter<Itms<I>>();

  /** The columns transcluded to the MatTable */
  columns: ItmColumnDef[];

  /** The keys of the columns to display */
  displayedColumns: string[];

  /** The selection of items in its current state */
  get selection(): Set<I> { return this._selectionSub.value; }

  /** The boolean or function to determine if the selection column is displayed */
  private _canSelect: boolean | ((item: I) => (boolean | Observable<boolean>));

  /** see [[ItmTableComponent.setRowClass]] */
  private _setRowClass: ((item: I) => (string | Observable<string>));

  /** The selection of items saved as behavior subject */
  private _selectionSub = new BehaviorSubject<Set<I>>(new Set());

  /** The subscription on selection subject to emit event */
  private _selectionSubscr = this._selectionSub.subscribe(
    selection => this.selectionChanges.next(Array.from(selection))
  );

  ngOnChanges({table: tableChanges}: SimpleChanges) {
    if (!tableChanges) return;
    const {columns, canSelect, setRowClass} = this.table;
    this._canSelect = (
      ['boolean', 'function'].indexOf(typeof canSelect) >= 0 ? canSelect : false
    );
    this._setRowClass = typeof setRowClass === 'function' ? setRowClass : () => '';
    this.columns = columns.map(def => new ItmColumnDef(
      typeof def === 'string' ? {key: def} : def
    ));
    this.displayedColumns = [
      ...(this._canSelect ? ['itm-selection'] : []),
      ...this.columns.map(({key}) => key)
    ];
    this._selectionSub.next(new Set());
  }

  ngOnDestroy() {
    this._selectionSubscr.unsubscribe();
  }

  /** Determines if the item row checkbox is enabled */
  isSelectable(item: I): Observable<boolean> {
    if (typeof this._canSelect === 'boolean') return of(this._canSelect);
    const res = this._canSelect(item);
    return res instanceof Observable ? res : of(res);
  }

  /** Determines if the item is selected */
  isSelected(item: I): boolean {
    return this._selectionSub.value.has(item);
  }

  /** Set CSS class on the item row */
  setRowClass(item: I): Observable<string> {
    if (!this._setRowClass) return null;
    const res = this._setRowClass(item);
    const obs = res instanceof Observable ? res : of(res);
    return obs.pipe(map(value => value + (this.isSelected(item) ? ' itm-selected' : '')));
  }

  /** Adds the item to the selection or remove it if selected */
  toggleItemSelection(item: I): void {
    const selection = this._selectionSub.value;
    if (selection.has(item)) selection.delete(item); else selection.add(item);
    this._selectionSub.next(new Set(selection));
  }
}
