import { Component, HostBinding } from '@angular/core';

import { NgControl } from './control';
import { ItmFieldLabel } from './field';

const SELECTOR = 'itm-control';

/** Default component for control area if not specified in config. */
@Component({
  selector: SELECTOR,
  template: `
    <mat-form-field>
      <input matInput [placeholder]="label | async" [formControl]="ngControl"/>
    </mat-form-field>
  `
})
export class ItmControlComponent {
  @HostBinding('class')
  /** The CSS class of the host element. */
  get hostClass(): string { return SELECTOR; }

  constructor(
    readonly label: ItmFieldLabel,
    readonly ngControl: NgControl
  ) { }
}
