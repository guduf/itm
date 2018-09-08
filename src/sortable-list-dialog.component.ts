import { Component, Inject, HostBinding, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { isArray } from 'util';
import { ItmListComponent } from './list.component';

export interface ItmSortableListDialogData<T> {
  values: T[];
}

const SELECTOR = 'itm-sortable-list-dialog';

@Component({
  selector: SELECTOR,
  templateUrl: 'sortable-list-dialog.component.html'
})
export class ItmSortableListDialogComponent<T> {
  values: T[];

  @ViewChild(ItmListComponent)
  listComponent: ItmListComponent<T>;

  @HostBinding('class')
  get hostClass() { return SELECTOR; }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    dialogData: ItmSortableListDialogData<T>,
    private _dialogRef: MatDialogRef<ItmSortableListDialogComponent<T>>
  ) {
    this.values = dialogData.values;
  }

  static create<T>(
    dialog: MatDialog,
    data: ItmSortableListDialogData<T>,
    config: MatDialogConfig<never> = {}
  ): MatDialogRef<ItmSortableListDialogComponent<T>, T[]> {
    return dialog.open<ItmSortableListDialogComponent<T>>(ItmSortableListDialogComponent, {
      ...config,
      data,
      panelClass: [
        `${SELECTOR}-panel`,
        ...(
          typeof config.panelClass === 'string' ? [config.panelClass] :
          isArray(config.panelClass) ? config.panelClass :
            []
        )
      ]
    });
  }

  /** Close the dialog and return undefined. */
  cancel(): void {
    this._dialogRef.close(undefined);
  }

  /** Close the dialog and return the sorted values if order changes.*/
  close(): void {
    this._dialogRef.close(this.listComponent.sortedValues);
  }
}
