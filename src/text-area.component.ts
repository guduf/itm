import { Component, HostBinding, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ItmAreaDef } from './area-def';
import { ItmTarget } from './item';

const SELECTOR = 'itm-text-area';

@Component({
  selector: SELECTOR,
  template: `{{rendered | async}}`
})
/**
 * Entry component created by CellDirective
 * when no component class is specified as cell for the ItmColumnDef. */
export class ItmTextAreaComponent<T = {}> {
  @HostBinding('class')
  /** The css class attached to the host. */
  get hostClass() { return SELECTOR; }

  /** The rendered string observable for the value. */
  rendered: Observable<string>;

  constructor(
    area: ItmAreaDef,
    target: ItmTarget
  ) {
    this.rendered = area.defaultText(target);
  }
}
