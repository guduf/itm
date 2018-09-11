import { Component, HostBinding } from '@angular/core';
import { ItmAreaDef } from './area-def';
import { Itm } from './item';
import { Observable } from 'rxjs';

const SELECTOR = 'itm-default-card-area';

@Component({
  selector: SELECTOR,
  template: `
    <span class="label">{{renderedLabel | async}}</span><br />
    <span class="text">{{renderedText | async}}<span>
  `
})
export class ItmDefaultCardAreaComponent {
  /** The rendered string observable for the label. */
  renderedLabel: Observable<string>;

  /** The rendered string observable for the value. */
  renderedText: Observable<string>;

  @HostBinding('class')
  /** The CSS class of the host element. */
  get hostClass(): string { return SELECTOR; }

  constructor(
    area: ItmAreaDef,
    item: Itm
  ) {
    this.renderedLabel = area.defaultLabel(item);
    this.renderedText = area.defaultText(item);
  }
}
