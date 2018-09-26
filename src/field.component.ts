import { Component, HostBinding } from '@angular/core';
import { Itm } from './item';
import { Observable } from 'rxjs';
import { ItmField } from './field';

const SELECTOR = 'itm-field';

@Component({
  selector: SELECTOR,
  template: `
    <span class="label">{{renderedLabel | async}}</span><br />
    <span class="text">{{renderedText | async}}<span>
  `
})
export class ItmFieldComponent {
  /** The rendered string observable for the label. */
  renderedLabel: Observable<string>;

  /** The rendered string observable for the value. */
  renderedText: Observable<string>;

  @HostBinding('class')
  /** The CSS class of the host element. */
  get hostClass(): string { return SELECTOR; }

  constructor(
    area: ItmField,
    item: Itm
  ) {
    this.renderedLabel = area.defaultLabel(item);
    this.renderedText = area.defaultText(item);
  }
}
