// tslint:disable-next-line:max-line-length
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, from, merge } from 'rxjs';
import { map, mergeMap, reduce, first, tap, distinct, skip } from 'rxjs/operators';

import { ItmColumnDef } from './column-def';
import { Itm, Itms, ItmsChanges, ItmsSource } from './itm';
import { ItmTableConfig } from './table-config';
import { ItmConfig } from './config';

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
  itemsSource: ItmsSource<I>;

  @Input()
  /** The table definition to configure the MatTable */
  table: ItmTableConfig<I>;

  @Input()
  /** The color of the material components inside the table */
  color: string;

  @Output()
  /** Emits selected items changes */
  readonly selectionChanges = new EventEmitter<Itms<I>>();

  /** The columns transcluded to the MatTable */
  columns: ItmColumnDef[];

  /** The keys of the columns to display. */
  displayedColumns: string[];

  /** see [[TableConfig.selectionLimit]]. */
  selectionLimit = 0;

  readonly itemsChanges: ItmsChanges<I>;

  /** Determines if all selectables items are selected observing selection limit */
  get isAllSelected(): boolean {
    if (this.selection.size >= this.items.length) return true;
    return (this.selection.size >= (
      this.selectionLimit ?
      Math.min(this.selectionLimit, this._selectableItems.size) :
      this._selectableItems.size
    ));
  }

  get isAllItemsToggable(): boolean {
    return (
      Boolean(this.selection.size) ||
      !this.selectionLimit ||
      this.selectionLimit >= this._selectableItems.size
    );
  }

  get items(): Itms<I> { return this._itemsChanges.getValue(); }

  /** The selection of items in its current state. */
  get selection(): Set<I> { return this._selectionChanges.getValue(); }

  /** Returns the icon of the selection header cell. */
  get selectionHeaderCellIcon(): string {
    const {indeterminateCheckBoxIcon, selectedCheckBoxIcon, unselectedCheckBoxIcon} = this._config;
    return (
      !this.selection.size ? unselectedCheckBoxIcon :
      this.isAllSelected ? selectedCheckBoxIcon :
        indeterminateCheckBoxIcon
    );
  }

  /** The CSS class of the selection header cell. */
  get selectionHeaderCellNgClass(): string {
    return 'itm-selection-header-cell';
  }

  /** The boolean or function to determine if the selection column is displayed */
  private _canSelect: boolean | ((item: I) => (boolean | Observable<boolean>));

  /** see [[ItmTableComponent.setRowClass]] */
  private _setRowClass: ((item: I) => (string | Observable<string>));

  /** The selection of items saved as behavior subject */
  private readonly _itemsChanges = new BehaviorSubject<Itms<I>>(null);

  /** The subscription on items source */
  private _itemsSubscr: Subscription;

  /** The selection of items saved as behavior subject */
  private readonly _selectionChanges = new BehaviorSubject<Set<I>>(new Set());

  /** The subscription on selection subject to emit event */
  private readonly _selectionSubscr: Subscription;

  private _selectableItems: Set<I> = new Set();

  /** The subscription on toggle selectable items */
  private _selectablesChangeSubscr: Subscription;
  private _selectableChangesSubscr: Subscription;

  constructor(private readonly _config: ItmConfig) {
    this.itemsChanges = this._itemsChanges.asObservable();
    this._selectionSubscr = this._selectionChanges.subscribe(
      selection => this.selectionChanges.next(Array.from(selection))
    );
  }

  ngOnChanges({table: tableChanges, itemsSource: itemSourceChanges}: SimpleChanges) {
    let selectablesMarkedForChanges = false;
    if (tableChanges) {
      const previous = (
        tableChanges.isFirstChange ? {} : tableChanges.previousValue
      ) as ItmTableConfig<I>;
      const {columns, canSelect, setRowClass, selectionLimit} = this.table;
      if (previous.canSelect !== canSelect) {
        this._canSelect = (
          ['boolean', 'function'].indexOf(typeof canSelect) >= 0 ? canSelect : false
        );
        selectablesMarkedForChanges = true;
      }
      if (previous.setRowClass !== setRowClass) (
        this._setRowClass = typeof setRowClass === 'function' ? setRowClass : () => ''
      );
      if (previous.selectionLimit !== selectionLimit) this.selectionLimit = selectionLimit || 0;
      if (previous.columns !== columns) {
        this.columns = columns.map(def => new ItmColumnDef(
          typeof def === 'string' ? {key: def} : def
        ));
        this.displayedColumns = [
          ...(this.columns.length && (this._canSelect ? ['itm-selection'] : [])),
          ...this.columns.map(({key}) => key)
        ];
        this._selectionChanges.next(new Set());
      }
    }
    if (itemSourceChanges) {
      if (this._itemsSubscr) this._itemsSubscr.unsubscribe();
      if (this.itemsSource instanceof Observable) this._itemsSubscr = this.itemsSource.subscribe(
        items => this._itemsChanges.next(items),
        err => console.error(err)
      );
      else this._itemsChanges.next(this.itemsSource);
      selectablesMarkedForChanges = true;
    }
    if (selectablesMarkedForChanges) this._filterSelectableItems();
  }

  ngOnDestroy() {
    this._selectionSubscr.unsubscribe();
    if (this._itemsSubscr) this._itemsSubscr.unsubscribe();
    if (this._selectableChangesSubscr) this._selectableChangesSubscr.unsubscribe();
    if (this._selectablesChangeSubscr) this._selectableChangesSubscr.unsubscribe();
  }

  /** Determines if the item row checkbox is enabled */
  isToggable(item: I): boolean {
    return (
      this.selection.has(item) ||
      this._selectableItems.has(item) &&
      (!this.selectionLimit || this.selectionLimit > this.selection.size)
    );
  }

  /** Determines if the item is selected */
  isSelected(item: I): boolean {
    return this._selectionChanges.value.has(item);
  }

  /** The icon of the selection cell */
  getSelectionCellIcon(item: I) {
    const {selectedCheckBoxIcon, unselectedCheckBoxIcon} = this._config;
    return this.isSelected(item) ? selectedCheckBoxIcon : unselectedCheckBoxIcon;
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
    const selection = this._selectionChanges.value;
    if (selection.has(item)) selection.delete(item); else selection.add(item);
    this._selectionChanges.next(new Set(selection));
  }

  /** Adds all items to the selection or removes it if selecteds */
  toggleAllSelection(): void {
    if (!this.isAllItemsToggable) return;
    this._selectionChanges.next(new Set(this.selection.size ? new Set() : this._selectableItems));
  }

  /** Returns a array of the selectable items */
  private _filterSelectableItems(): void {
    if (this._selectableChangesSubscr) this._selectableChangesSubscr.unsubscribe();
    if (this._selectablesChangeSubscr) this._selectableChangesSubscr.unsubscribe();
    if (!this._canSelect) this._selectableItems = new Set();
    if (typeof this._canSelect !== 'function') (
      this._selectableItems = new Set(this.items)
    );
    else {
      const selectableChanges: Observable<boolean>[] = [];
      this._selectablesChangeSubscr = from(this.items)
        .pipe(
          distinct(),
          mergeMap(item => {
            let res: Observable<boolean>;
            try { res = (this._canSelect as ((item: I) => (Observable<boolean>)))(item); }
            catch (err) { console.error(err); }
            if (res instanceof Observable) selectableChanges.push(res.pipe(skip(1)));
            else res = of(res);
            return res.pipe(first(), map(isSelectable => isSelectable ? item : null));
          }),
          reduce<I>((selectables, item) => ([...selectables, ...(item ? [item] : [])]), []),
          tap(selectables => (this._selectableItems = new Set(selectables)))
        )
        .subscribe(null, err => console.error(err));
      this._selectableChangesSubscr = merge(...selectableChanges)
        .pipe(tap(() => this._filterSelectableItems()))
        .subscribe(null, err => console.error(err));
    }
  }
}
