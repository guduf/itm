import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import Action from './action';
import ActionEvent from './action-event';
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
    @Inject(Action.SET_TOKEN)
    readonly actions: Set<Action.Record>,
    @Inject(Action.BUTTON_MODE_TOKEN)
    readonly buttonsMode: Observable<ItmButtonMode>,
    @Inject(ActionEvent.EMITTER_TOKEN)
    readonly emitter: ActionEvent.Emitter,
    @Inject(ITM_TARGET)
    readonly target: T
  ) { }
}
