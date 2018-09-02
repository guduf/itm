import { Component, Inject, HostBinding } from '@angular/core';
import { ItmColumnDef } from './column-def';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { isArray } from 'util';

export interface ItmTableOrganizerDialogData {
  columns: ItmColumnDef[];
}

const SELECTOR = 'itm-table-organizer-dialog';

@Component({
  selector: SELECTOR,
  templateUrl: 'table-organizer-dialog.component.html'
})
export class ItmTableOrganizerDialogComponent {
  columns: string[];

  @HostBinding('class')
  get hostClass() { return SELECTOR; }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    dialogData: ItmTableOrganizerDialogData
  ) {
    this.columns = dialogData.columns.map(col => col.key);
  }

  static create(
    dialog: MatDialog,
    data: ItmTableOrganizerDialogData,
    config: MatDialogConfig<never> = {}
  ): MatDialogRef<ItmTableOrganizerDialogComponent, ItmColumnDef[]> {
    return dialog.open(ItmTableOrganizerDialogComponent, {
      ...config,
      data,
      panelClass: [
        `${SELECTOR}-panel`,
        ...(typeof config.panelClass === 'string' ? [config.panelClass] :
          isArray(config.panelClass) ? config.panelClass :
            []
        )
      ]
    });
  }
}
