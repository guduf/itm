// tslint:disable:max-line-length
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { BehaviorSubject, from, fromEvent , merge, Observable, of, Subscription } from 'rxjs';
import { distinctUntilChanged, first, map, mergeMap, reduce, startWith, skip, tap } from 'rxjs/operators';
// tslint:enable:max-line-length

import { ItmActionConfig, ItmActionEvent, ItmActionDef } from './action';
import { ItmColumnDef } from './column-def';
import { ItmButtonMode } from './button.component';
import { ItmConfig } from './config';
import { Itm, ItmsChanges, ItmsSource, deferPipe, ItmPipe } from './item';
import { ItmTableConfig } from './table-config';

const SELECTOR = 'itm-table';

const ITM_TABLE_ORDER_COLUMNS = new ItmActionDef({
  key: 'itm_table_order_columns',
  icon: 'view_columns'
});

@Component({
  selector: SELECTOR,
  templateUrl: './table.component.html'
})
/**
 * Exported component to display ItmTableConfig.
 */
export class ItmTableComponent<I extends Itm = Itm> implements OnChanges, OnDestroy {
  @Input()
  /** @Input The color of the material components inside the table. */
  color: string;

  @Input()
  /** @Input Data source for MatTable and provider for ItmHeaderCellComponent. */
  itemsSource: ItmsSource<I>;

  @Input()
  /** The table definition to configure the MatTable. */
  table: ItmTableConfig<I>;

  @Output()
  /** @Output Emitter of action events */
  readonly event = new EventEmitter<ItmActionEvent<I>>();

  @Output()
  /** @Output Emits selected items changes. */
  readonly selectionChanges = new EventEmitter<I[]>();

  /** The actions for the row cell */
  actions: ItmActionConfig[];

  /** The columns transcluded to the MatTable */
  columns: ItmColumnDef[];

  /** The keys of the columns to display. */
  displayedColumns: string[];

  /** The observable to set the style of the header row. */
  headerRowStyle: Observable<{ [key: string]: string; }>;

  /** see [[TableConfig.selectionLimit]]. */
  selectionLimit = 0;

  @ViewChild(MatMenuTrigger)
  /** The trigger for the tabble menu */
  menuTrigger: MatMenuTrigger;

  menuHeaderActions: ItmActionDef[];

  /** The display of the actions cells buttons */
  readonly actionsButtonsMode = new BehaviorSubject<ItmButtonMode>('icon');

  /** The observable of items changes. */
  readonly itemsChanges: ItmsChanges<I>;

  @HostBinding('class')
  get hostClass() {
    return SELECTOR;
  }

  get actionCellClass() {
    const size  = Math.ceil(this.actions.length * 40 / 60);
    return `itm-action-cell itm-slot-${size}`;
  }

  get actionHeaderCellClass() {
    const size  = Math.ceil(this.actions.length * 40 / 60);
    return `itm-action-header-cell itm-slot-${size}`;
  }

  get headerRowClass() {
    return 'itm-header-row';
  }

  /** Determines if all selectables items are selected observing selection limit. */
  get isAllSelected(): boolean {
    if (this.selection.size >= this.items.length) return true;
    return (this.selection.size >= (
      this.selectionLimit ?
      Math.min(this.selectionLimit, this._selectableItems.size) :
      this._selectableItems.size
    ));
  }

  /** Determines if is possible to select or unselect all items. */
  get isAllItemsToggable(): boolean {
    return (
      Boolean(this.selection.size) ||
      !this.selectionLimit ||
      this.selectionLimit >= this._selectableItems.size
    );
  }

  /** The current items currently of the table. */
  get items(): I[] { return this._itemsChanges.getValue(); }

  /** The CSS class of the table menu */
  get menuClass(): string { return 'itm-table-menu'; }

  /** The current selection of items. */
  get selection(): Set<I> { return this._selectionChanges.getValue(); }

  /** The CSS class of the selection cells. */
  get selectionCellClass(): string {
    return `itm-selection-cell`;
  }

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
  get selectionHeaderCellClass(): string {
    return 'itm-selection-header-cell';
  }

  /** The boolean or function to determine if the selection column is displayed. */
  private _canSelect: boolean | ItmPipe<I, boolean>;

  /** see [[ItmTableComponent.setRowClass]]. */
  private _setRowClass: false | ItmPipe<I, string>;

  /** The selection of items saved as behavior subject. */
  private readonly _itemsChanges = new BehaviorSubject<I[]>(null);

  /** The subscription on items source. */
  private _itemsSubscr: Subscription;

  /** The selection of items saved as behavior subject. */
  private readonly _selectionChanges = new BehaviorSubject<Set<I>>(new Set());

  /** The subscription on selection subject to emit event. */
  private readonly _selectionSubscr: Subscription;

  /** The set of selectable items. */
  private _selectableItems: Set<I> = new Set();

  /** The subscription on toggle selectable items. */
  private _selectablesChangeSubscr: Subscription;

  /** The subsription on toggle each selectable item. */
  private _selectableChangesSubscr: Subscription;

  /** The scroll subscription */
  private readonly _scrollSubscr: Subscription;

  constructor(private readonly _config: ItmConfig, hostRef: ElementRef) {
    this.itemsChanges = this._itemsChanges.asObservable();
    this._selectionSubscr = this._selectionChanges.subscribe(
      selection => this.selectionChanges.next(Array.from(selection))
    );
    this._setHeaderRowStyle(hostRef);
    if (typeof window === 'undefined') return;
    this._scrollSubscr = fromEvent(window, 'scroll', {passive: true})
      .subscribe(() => this.menuTrigger && this.menuTrigger.closeMenu());
    this.menuHeaderActions = [ITM_TABLE_ORDER_COLUMNS];
  }

  ngOnChanges({table: tableChanges, itemsSource: itemSourceChanges}: SimpleChanges) {
    let selectablesMarkedForChanges = false;
    if (tableChanges) {
      const previous = (
        tableChanges.isFirstChange ? {} : tableChanges.previousValue
      ) as ItmTableConfig<I>;
      const {actions, columns, canSelect, setRowClass, selectionLimit} = this.table;
      if (previous.actions !== actions) this.actions = actions || null;
      if (previous.canSelect !== canSelect) {
        this._canSelect = (
          canSelect === true ? true :
          typeof canSelect === 'function' ? deferPipe(canSelect) :
          false
        );
        selectablesMarkedForChanges = true;
      }
      if (previous.setRowClass !== setRowClass) this._setRowClass = (
        typeof setRowClass === 'function' ? deferPipe(setRowClass) : false
      );
      if (previous.selectionLimit !== selectionLimit) this.selectionLimit = selectionLimit || 0;
      if (previous.columns !== columns) {
        this.columns = columns.map(def => new ItmColumnDef(
          typeof def === 'string' ? {key: def} : def
        ));
        this.displayedColumns = [
          ...(this.columns.length && (this._canSelect ? ['itm-selection'] : [])),
          ...this.columns.map(({key}) => key),
          ...(this.actions ? ['itm-actions'] : []),
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
    if (this._scrollSubscr) this._scrollSubscr.unsubscribe();
  }

  /** Determines if the item is selected. */
  isSelected(item: I): boolean {
    return this._selectionChanges.value.has(item);
  }

  /** Determines if the item row checkbox is enabled. */
  isToggable(item: I): boolean {
    return (
      this.selection.has(item) ||
      this._selectableItems.has(item) &&
      (!this.selectionLimit || this.selectionLimit > this.selection.size)
    );
  }

  getCellClass(column: ItmColumnDef) {
    return `itm-cell itm-slot-${column.size}`;
  }

  getHeaderCellClass(column: ItmColumnDef) {
    return `itm-header-cell itm-slot-${column.size}`;
  }

  /** Set CSS class on the item row. */
  getRowClass(item: I): Observable<string> {
    return (typeof this._setRowClass === 'function' ? this._setRowClass(item) : of('')).pipe(
      map(value => ('itm-row ' + (this.isSelected(item) ? 'itm-row-selected ' : '') + value))
    );
  }

  /** The icon of the selection cell. */
  getSelectionCellIcon(item: I) {
    const {selectedCheckBoxIcon, unselectedCheckBoxIcon} = this._config;
    return this.isSelected(item) ? selectedCheckBoxIcon : unselectedCheckBoxIcon;
  }

  /** Adds the item to the selection or removes it if selected. */
  toggleItemSelection(item: I): void {
    const selection = this._selectionChanges.value;
    if (selection.has(item)) selection.delete(item);
    else selection.add(item);
    this._selectionChanges.next(new Set(selection));
  }

  /** Adds all items to the selection or removess it if selecteds. */
  toggleAllSelection(): void {
    if (!this.isAllItemsToggable) return;
    this._selectionChanges.next(new Set(this.selection.size ? new Set() : this._selectableItems));
  }

  /** Returns a array of the selectable items. */
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
          distinctUntilChanged(),
          mergeMap(item => {
            let res: Observable<boolean>;
            try { res = (this._canSelect as ((item: I) => (Observable<boolean>)))(item); }
            catch (err) { console.error(err); }
            if (res instanceof Observable) (
              selectableChanges.push(res.pipe(skip(1), distinctUntilChanged()))
            );
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

  /** Set the header row style observable in DOM environment */
  private _setHeaderRowStyle(hostRef: ElementRef) {
    const hostEl: HTMLElement = hostRef.nativeElement;
    if (!(hostEl instanceof HTMLElement)) return;
    this.headerRowStyle = merge(
      fromEvent(window, 'resize', {passive: true}),
      fromEvent(window, 'scroll', {passive: true})
    ).pipe(
      startWith(null),
      map(() => {
        const tableEl = hostEl.querySelector('mat-table.mat-table');
        if (!tableEl) return 0;
        const {bottom, height, top} = tableEl.getBoundingClientRect();
        if (top >= 0 || bottom <= 0 || tableEl.childElementCount < 3) return 0;
        const offset = top >= 0 ? 0 : -top;
        const limit = (
          height -
          tableEl.firstElementChild.getBoundingClientRect().height -
          tableEl.lastElementChild.getBoundingClientRect().height
        );
        return offset > limit ? limit : offset;
      }),
      distinctUntilChanged(),
      map(top => top ? {top: `${top}px`} : {})
    );
  }
}
