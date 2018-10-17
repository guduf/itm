import { Component, HostBinding, Inject } from '@angular/core';

import Action from './action';
import Area, { ITM_AREA_RECORD_TOKEN } from './area';
import { ITM_TARGET } from './item';
import { RecordOf } from 'immutable';

const SELECTOR = 'itm-area-action';

@Component({
  selector: SELECTOR,
  template: `<itm-button [action]="actionArea" [target]="target"></itm-button>`
})
export class ItmActionAreaComponent<T extends Object = {}> {
  @HostBinding('class')
  /** The CSS class of the host element. */
  get hostClass(): string { return SELECTOR; }

  constructor(
    @Inject(ITM_AREA_RECORD_TOKEN)
    readonly actionArea: Area<T> & Action<T>,
    @Inject(ITM_TARGET)
    readonly target: T
  ) { }
}
