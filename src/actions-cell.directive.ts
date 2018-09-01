import { Directive, EventEmitter, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AbstractItmCellDirective } from './abstract-cell.directive';
// tslint:disable-next-line:max-line-length
import { ItmActionConfig, ItmActionDefs, ItmActionEvent, ITM_TABLE_ACTIONS_BUTTONS_MODE } from './action';
import { ItmButtonMode } from './button.component';
import { ItmConfig } from './config';
import { Itm } from './item';

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

  @Input()
  /** The mode of the actions cells buttons */
  buttonsMode: Observable<ItmButtonMode>;

  ngOnInit() {
    this._createCellComponent(
      this._injector.get(ItmConfig).defaultActionsCellComp,
      [
        {provide: Itm, useValue: this.item},
        {provide: ItmActionDefs, useValue: this.actions},
        {provide: EventEmitter, useValue: this.eventEmitter},
        {provide: ITM_TABLE_ACTIONS_BUTTONS_MODE, useValue: this.buttonsMode}
      ]
    );
  }
}
