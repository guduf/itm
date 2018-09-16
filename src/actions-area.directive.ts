import { Directive, EventEmitter, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// tslint:disable-next-line:max-line-length
import { ItmActionConfig, ItmActionDefs, ITM_TABLE_ACTIONS_BUTTONS_MODE, ItmActionDef } from './action';
import { ItmButtonMode } from './button.component';
import { ItmConfig } from './config';
import { Itm } from './item';
import { ItmAreaDirective } from './area.directive';

@Directive({selector: '[itmActionsArea]'})
// tslint:disable-next-line:max-line-length
export class ItmActionsAreaDirective<
  T = {},
  A extends ItmActionDef<T> = ItmActionDef<T>
> extends ItmAreaDirective<T, A> implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input()
  actions: ItmActionConfig[];

  @Input()
  /** The mode of the actions cells buttons */
  buttonsMode: Observable<ItmButtonMode>;

  ngOnInit() {
    this._createComponent(
      this._injector.get(ItmConfig).defaultActionsAreaComp,
      [
        {provide: ItmActionDefs, useValue: this.actions},
        {provide: ITM_TABLE_ACTIONS_BUTTONS_MODE, useValue: this.buttonsMode}
      ]
    );
  }
}
