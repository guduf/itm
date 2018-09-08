import { Component, OnDestroy, Input, ViewChild } from '@angular/core';
import { ItmTableComponent } from './table.component';
import { ItmActionDef, ItmActionEvent } from './action';
import { MatMenuTrigger, MatDialog } from '@angular/material';
import { ItmSortableListDialogComponent } from './sortable-list-dialog.component';
import { Subscription, fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

const ITM_TABLE_ORDER_COLUMNS_ACTION = new ItmActionDef({
  key: 'itm_table_order_columns',
  icon: 'view_columns'
});

@Component({
  selector: 'itm-table-settings',
  templateUrl: 'table-settings.component.html'
})
export class ItmTableSettingsComponent implements OnDestroy {
  @Input()
  table: ItmTableComponent;

  @ViewChild(MatMenuTrigger)
  /** The trigger for the tabble menu. */
  menuTrigger: MatMenuTrigger;

  menuHeaderActions = [ITM_TABLE_ORDER_COLUMNS_ACTION];

  /** The CSS class of the table menu. */
  get menuClass(): string { return 'itm-table-menu'; }

  /** The scroll subscription. */
  private readonly _scrollSubscr: Subscription;

  /** The organizer dialog subscription. */
  private _organizerDialogSubscr: Subscription;

  constructor(private _dialog: MatDialog) {
    if (typeof window === 'undefined') return;
    this._scrollSubscr = fromEvent(window, 'scroll', {passive: true})
      .subscribe(() => this.menuTrigger && this.menuTrigger.closeMenu());
  }

  ngOnDestroy() {
    if (this._scrollSubscr) this._scrollSubscr.unsubscribe();
    if (this._organizerDialogSubscr) this._organizerDialogSubscr.unsubscribe();
    if (this.menuTrigger.menuOpen) this.menuTrigger.closeMenu();
  }

  onMenuHeaderEvent({action}: ItmActionEvent) {
    switch (action) {
      case ITM_TABLE_ORDER_COLUMNS_ACTION: return this._openOrganizerDialog();
      default: return;
    }
  }

  /** Opens the ItmSortableListDialogComponent */
  private _openOrganizerDialog(): void {
    const values = this.table.displayedColumns.filter(key => key[0] !== '$');
    const dialogRef = ItmSortableListDialogComponent.create<string>(this._dialog, {values});
    this._organizerDialogSubscr = dialogRef.afterClosed()
      .pipe(filter(sortedColumns => sortedColumns !== values))
      .subscribe(
        sortedColumns => (this.table.settings.columns = sortedColumns),
        err => console.error(err),
        () => dialogRef.close()
      );
  }
}
