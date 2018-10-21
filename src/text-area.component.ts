import { Component, HostBinding } from '@angular/core';
import { ItmAreaText } from './area';

const SELECTOR = 'itm-text-area';

@Component({
  selector: SELECTOR,
  template: `{{text | async}}`
})
/**
 * Entry component created by CellDirective
 * when no component class is specified as cell for the ItmColumn. */
export class ItmTextAreaComponent {
  @HostBinding('class')
  /** The css class attached to the host. */
  get hostClass() { return SELECTOR; }

  constructor(
    readonly text: ItmAreaText
  ) { }
}
