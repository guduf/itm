import { Component, HostBinding, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import Control from './control';
import { fromStringPipe } from './item';
import GridControl from './grid-control';
import { ITM_GRID_AREA_TOKEN } from './grid-area';
import { AbstractControl } from '@angular/forms';

const SELECTOR = 'itm-control';

@Component({
  selector: SELECTOR,
  template: `
    <mat-form-field>
      <input matInput
        [type]="control.type"
        [placeholder]="renderedLabel | async"
        [formControl]="formControl"/>
    </mat-form-field>
  `
})
export class ItmControlComponent {
  /** The rendered string observable for the label. */
  readonly renderedLabel: Observable<string>;

  get control(): Control { return this._gridControl.area; }

  get formControl(): AbstractControl { return this._gridControl.formControl; }

  @HostBinding('class')
  /** The CSS class of the host element. */
  get hostClass(): string { return SELECTOR; }

  constructor(
    @Inject(ITM_GRID_AREA_TOKEN)
    private readonly _gridControl: GridControl
  ) {
    const {area: {label}, target} = _gridControl;
    this.renderedLabel = label === false ? null : fromStringPipe(label, target.value);
  }
}
