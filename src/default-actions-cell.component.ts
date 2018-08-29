import { Component, EventEmitter } from '@angular/core';

import { Itm } from './item';
import { ItmActionDefs, ItmActionEvent } from './action';

@Component({
  selector: 'itm-actions-cell',
  template: `
    <itm-buttons
      [actions]="actions"
      [target]="item"
      [mode]="mode"
      (event)="emitter.emit($event)"></itm-buttons>
    `
})
export class ItmDefaultActionsCellComponent<I extends Itm = Itm> {
  constructor(
    readonly actions: ItmActionDefs,
    readonly item: Itm,
    readonly emitter: EventEmitter<ItmActionEvent<I>>
  ) { }

  mode = 'icon';
}
