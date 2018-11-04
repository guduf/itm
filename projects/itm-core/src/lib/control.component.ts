import { Component, HostBinding } from '@angular/core';

import ControlRef from './control_ref';
import { ItmFieldLabel } from './field';
import { AbstractControl } from '@angular/forms';

const SELECTOR = 'itm-control';

/** Default component for control area if not specified in config. */
@Component({
  selector: SELECTOR,
  template: `
    <mat-form-field>
      <input
        matInput [required]="required" [placeholder]="label | async"
        [formControl]="ngControl" />
    </mat-form-field>
  `
})
export class ItmControlComponent {
  @HostBinding('class')
  /** The CSS class of the host element. */
  get hostClass(): string { return SELECTOR; }

  get ngControl(): AbstractControl { return this._controlRef; }

  get required(): boolean { return this._controlRef.record.required; }

  constructor(
    readonly label: ItmFieldLabel,
    private readonly _controlRef: ControlRef
  ) { }
}
