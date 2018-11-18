import { ItmTarget } from '../../../../itm-core/src/public_api';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TemplateRef, ViewChild, HostListener, Component } from '@angular/core';

@Component({
  selector: 'itm-demo-radar-example',
  template: `
    <button mat-icon-button><mat-icon>my_location</mat-icon></button>
    <span>GEO</span><span>RADAR</span>
    <ng-template #dialog>
      <mat-dialog-content>{{dialogText}}</mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button (click)="close()">Close</button>
      </mat-dialog-actions>
    </ng-template>
  `,
  styles: [`
    button { margin-bottom: 1rem; }
    span { display: block; text-align: center; }
  `]
})
export class RadarExampleComponent {
  @ViewChild('dialog', {read: TemplateRef})
  dialogTemplateRef: TemplateRef<{}>;

  get dialogText(): string {
    const {firstName, lastName} = this._target.value;
    return `${firstName} ${lastName} is in ${this._location}.`;
  }

  private _dialogRef: MatDialogRef<{}>;

  private _location: string;

  constructor(
    private _dialog: MatDialog,
    private _target: ItmTarget<{ firstName: string, lastName: string }>
  ) { }

  close(): void {
    this._location = null;
    this._dialogRef.close();
  }

  @HostListener('click')
  open(): void {
    this._location = this._localize();
    this._dialogRef = this._dialog.open(this.dialogTemplateRef);
  }

  private _localize(): string {
    // Dummy implementation.
    return 'Coastpolis';
  }
}
