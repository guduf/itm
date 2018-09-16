import { Component, EventEmitter, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ItmActionDefs, ItmActionEvent, ITM_TABLE_ACTIONS_BUTTONS_MODE } from './action';
import { ItmButtonMode } from './button.component';
import { Itm, ItmTarget } from './item';

@Component({
  selector: 'itm-actions-area',
  template: `
    <itm-buttons
      [actions]="actions"
      [target]="target"
      [mode]="buttonsMode | async"
      (event)="emitter.emit($event)"></itm-buttons>
    `
})
export class ItmActionsAreaComponent<T = {}> {
  constructor(
    readonly actions: ItmActionDefs,
    readonly target: ItmTarget,
    readonly emitter: EventEmitter<ItmActionEvent<T>>,
    @Inject(ITM_TABLE_ACTIONS_BUTTONS_MODE)
    readonly buttonsMode: Observable<ItmButtonMode>
  ) { }
}
