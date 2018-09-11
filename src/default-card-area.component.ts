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
  renderedLabel: Observable<string>;
  renderedText: Observable<string>;

  @HostBinding('class')
  get hostClass(): string { return SELECTOR; }

  constructor(
    area: ItmAreaDef,
    item: Itm
  ) {
    this.renderedLabel = area.defaultLabel(item);
    this.renderedText = area.defaultText(item);
  }
}
