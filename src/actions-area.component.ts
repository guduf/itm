import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ITM_ACTIONS, ITM_TABLE_ACTIONS_BUTTONS_MODE, ItmActionEmitter, ItmAction } from './action';
import { ItmButtonMode } from './button.component';
import { ITM_TARGET } from './item';

@Component({
  selector: 'itm-actions-area',
  template: `
    <itm-buttons
      [actions]="actions"
      [target]="target"
      [mode]="buttonsMode | async"
      (event)="emitter.next($event)"></itm-buttons>
    `
})
export class ItmActionsAreaComponent<T = {}> {
  constructor(
    @Inject(ITM_ACTIONS)
    readonly actions: Set<ItmAction>,
    @Inject(ITM_TABLE_ACTIONS_BUTTONS_MODE)
    readonly buttonsMode: Observable<ItmButtonMode>,
    readonly emitter: ItmActionEmitter,
    @Inject(ITM_TARGET)
    readonly target: T
  ) { }
}
