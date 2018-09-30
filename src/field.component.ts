import { Component, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';
import Inject from './di';
import { Itm, fromStringPipe } from './item';
import Field from './field';

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
    @Inject.area
    area: Field.Record,
    @Inject.target
    item: Itm
  ) {
    this.renderedLabel = fromStringPipe(area.label, item);
    this.renderedText = fromStringPipe(area.text, item);
  }
}
