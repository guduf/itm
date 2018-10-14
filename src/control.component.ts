import { Component, HostBinding, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { fromStringPipe } from './item';
import GridControl from './grid-control';
import Area from './area';
import { ITM_GRID_AREA_TOKEN } from './grid-area';

const SELECTOR = 'itm-control';

@Component({
  selector: SELECTOR,
  template: `
    <mat-form-field>
      <input matInput
        [type]="control.area.type"
        [placeholder]="renderedLabel | async"
        [formControl]="control.formControl"/>
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
    @Inject(ITM_GRID_AREA_TOKEN)
    readonly control: GridControl
  ) {
    const {area: {label}, target} = control;
    this.renderedLabel = label === false ? null : fromStringPipe(label, target.value);
  }
}
