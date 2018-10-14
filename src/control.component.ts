import { Component, HostBinding, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Itm, fromStringPipe, ITM_TARGET } from './item';
import Control from './control';
import Area from './area';

const SELECTOR = 'itm-control';

@Component({
  selector: SELECTOR,
  template: `
    <mat-form-field>
      <input matInput [type]="control.type" [placeholder]="renderedLabel | async"/>
    </mat-form-field>
  `
})
export class ItmControlComponent {
  /** The rendered string observable for the label. */
  readonly renderedLabel: Observable<string>;

  @HostBinding('class')
  /** The CSS class of the host element. */
  get hostClass(): string { return SELECTOR; }

  constructor(
    @Inject(Area.RECORD_TOKEN)
    readonly control: Control,
    @Inject(ITM_TARGET)
    readonly item: Itm
  ) {
    this.renderedLabel = control.label === false ? null : fromStringPipe(control.label, item);
  }
}