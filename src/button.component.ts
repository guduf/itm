import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ItmActionConfig, ItmActionDef, ItmActionEvent } from './action';

/** The possible display modes for the button. */
export type ItmButtonMode = 'icon' | 'menu';

@Component({
  selector: 'itm-button',
  templateUrl: 'button.component.html'
})
export class ItmButtonComponent<T = {}> implements OnChanges {
  /** The target of the button action. */
  @Input()
  target: T;

  @Input()
  /** The display mode of the button. */
  mode: ItmButtonMode;

  @Output()
  /** The emitter of action event. */
  event = new EventEmitter<ItmActionEvent>();

  /** The action configuration managed by the button. */
  @Input()
  action: ItmActionConfig | ItmActionDef;

  /** The definition of the action. */
  actionDef: ItmActionDef;

  ngOnChanges({action: actionChanges}: SimpleChanges) {
    if (actionChanges)
      if (this.action instanceof ItmActionDef) this.actionDef = this.action;
      else try { this.actionDef = new ItmActionDef(this.action); }
      catch (err) { console.error(err); }
  }

  /** Emits a event action. */
  emitEvent(nativeEvent: any) {
    this.event.emit(new ItmActionEvent(this.actionDef, nativeEvent, this.target));
  }
}
