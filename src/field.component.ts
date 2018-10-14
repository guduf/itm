import { Component, HostBinding, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Itm, fromStringPipe, ITM_TARGET } from './item';
import Field from './field';
import Area from './area';
import { RecordOf } from 'immutable';

const SELECTOR = 'itm-field';

@Component({
  selector: SELECTOR,
  template: `
    <span class="${SELECTOR}-label">{{renderedLabel | async}}</span><br />
    <span class="${SELECTOR}-text">{{renderedText | async}}<span>
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
    @Inject(Area.RECORD_TOKEN)
    area: Area & RecordOf<Field.Model>,
    @Inject(ITM_TARGET)
    item: Itm
  ) {
    this.renderedLabel = area.label === false ? null : fromStringPipe(area.label, item);
    this.renderedText = fromStringPipe(area.text, item);
  }
}
