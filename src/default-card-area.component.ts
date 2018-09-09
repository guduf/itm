import { Component, EventEmitter, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ItmActionDefs, ItmActionEvent, ITM_TABLE_ACTIONS_BUTTONS_MODE } from './action';
import { ItmButtonMode } from './button.component';
import { Itm } from './item';

@Component({
  selector: 'itm-card-area',
  template: `
    <itm-buttons
      [actions]="actions"
      [target]="item"
      [mode]="buttonsMode | async"
      (event)="emitter.emit($event)"></itm-buttons>
    `
})
export class ItmDefaultActionsCellComponent<I extends Itm = Itm> {
  constructor(
    readonly actions: ItmActionDefs,
    readonly item: Itm,
    readonly emitter: EventEmitter<ItmActionEvent<I>>,
    readonly cardArea: ItmCardAreaDef<I>
  ) { }
}
