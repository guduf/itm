import { Component, Input, EventEmitter, Output } from '@angular/core';

import { ItmActionConfig, ItmActionDef, ItmActionEvent } from './action';
import { ItmButtonMode } from './button.component';

@Component({
  selector: 'itm-buttons',
  templateUrl: './buttons.component.html'
})
export class ItmButtonsComponent<T = {}> {
  @Input()
  /** The target of the buttons action. */
  target: T;

  @Input()
  /** The display mode of the buttons. */
  mode: ItmButtonMode;

  @Input()
  /** The action definitions iterated to create buttons. */
  actions: (ItmActionConfig | ItmActionDef)[];

  @Input()
  /** The icon of menu button. */
  menuIcon = 'more_vert';

  @Output()
  /** The emitter of buttons events. */
  event = new EventEmitter<ItmActionEvent>();
}
