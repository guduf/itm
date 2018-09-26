import { Component, HostBinding, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ItmArea } from './area';
import { ITM_TARGET } from './item';

const SELECTOR = 'itm-text-area';

@Component({
  selector: SELECTOR,
  template: `{{rendered | async}}`
})
/**
 * Entry component created by CellDirective
 * when no component class is specified as cell for the ItmColumn. */
export class ItmTextAreaComponent<T = {}> {
  @HostBinding('class')
  /** The css class attached to the host. */
  get hostClass() { return SELECTOR; }

  /** The rendered string observable for the value. */
  rendered: Observable<string>;

  constructor(
    area: ItmArea,
    @Inject(ITM_TARGET)
    target: T
  ) {
    this.rendered = (
      typeof area.defaultText === 'function' ? area.defaultText(target) : of(area.key)
    );
  }
}
