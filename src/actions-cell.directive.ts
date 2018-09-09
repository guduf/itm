import { Directive, EventEmitter, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// tslint:disable-next-line:max-line-length
import { ItmActionConfig, ItmActionDefs, ITM_TABLE_ACTIONS_BUTTONS_MODE, ItmActionDef } from './action';
import { ItmButtonMode } from './button.component';
import { ItmConfig } from './config';
import { Itm } from './item';
import { ItmTypedAreaDirective } from './area.directive';
import { ItmColumnDirective } from './column.directive';
import { ItmColumnDef } from './column';

@Directive({selector: '[itmActionsCell]'})
// tslint:disable-next-line:max-line-length
export class ItmActionsCellDirective<
  I extends Itm = Itm,
  A extends ItmActionDef<I> = ItmActionDef<I>
> extends ItmTypedAreaDirective<I, I, A> implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('itmActionsCell')
  actions: ItmActionConfig[];

  @Input()
  /** The mode of the actions cells buttons */
  buttonsMode: Observable<ItmButtonMode>;

  ngOnInit() {
    this._createComponent(
      this._injector.get(ItmConfig).defaultActionsCellComp,
      [
        {provide: ItmActionDefs, useValue: this.actions},
        {provide: ITM_TABLE_ACTIONS_BUTTONS_MODE, useValue: this.buttonsMode}
      ]
    );
  }
}
