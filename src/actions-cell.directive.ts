import { Directive, Input, OnInit, EventEmitter } from '@angular/core';

import { AbstractItmCellDirective } from './abstract-cell.directive';
import { Itm } from './item';
import { ItmActionConfig, ItmActionDefs, ItmActionEvent } from './action';
import { ItmConfig } from './config';

@Directive({selector: '[itmActionsCell]'})
// tslint:disable-next-line:max-line-length
export class ItmActionsCellDirective<I extends Itm = Itm> extends AbstractItmCellDirective implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('itmActionsCell')
  /** The item of the cell. */
  item: I;

  @Input()
  /** The actions of the cell. */
  actions: ItmActionConfig[];

  @Input()
  /** The event emitter for button actions */
  eventEmitter: EventEmitter<ItmActionEvent<I>>;

  ngOnInit() {
    this._createCellComponent(
      this._injector.get(ItmConfig).defaultActionsCellComp,
      [
        {provide: Itm, useValue: this.item},
        {provide: ItmActionDefs, useValue: this.actions},
        {provide: EventEmitter, useValue: this.eventEmitter}
      ]
    );
  }
}
