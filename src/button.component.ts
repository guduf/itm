// tslint:disable-next-line:max-line-length
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';

import Action, { ItmAction } from './action';
import ActionEvent from './action-event';
import { fromStringPipe } from './item';

/** The possible display modes for the button. */
export type ItmButtonMode = 'icon' | 'menu';

/** The selector of ItmButtonComponent */
const SELECTOR = 'itm-button';

@Component({
  selector: SELECTOR,
  templateUrl: 'button.component.html'
})
export class ItmButtonComponent<T = {}> implements OnChanges {
  /** The target of the button action. */
  @Input()
  target: T;

  /** The display mode of the button. */
  @Input()
  mode: ItmButtonMode;

  @Output()
  /** The emitter of action event. */
  event = new EventEmitter<ActionEvent>();

  /** The action configuration managed by the button. */
  @Input()
  action: string | ItmAction.Config<T>;

  /** The icon of the button. */
  icon: Observable<string>;

  /** The text of the button. */
  text: Observable<string>;

  /** The action definition of the button. */
  actionDef: Action.Record<T>;

  @HostBinding('class')
  /** The CSS class of host element. */
  get hostClass() {
    return SELECTOR + (this.mode ? ` ${SELECTOR}-${this.mode}` : '');
  }

  /**	Whether the icon is displayed. */
  get isIconButton() {
    return this.mode !== 'menu';
  }
  /**	Whether the text is displayed. */
  get isTextButton() {
    return this.mode !== 'icon';
  }

  ngOnChanges({action: actionChanges}: SimpleChanges) {
    if (actionChanges)
      if (Action.factory.isFactoryRecord(this.action))
        this.actionDef = this.action as Action.Record;
      else try {
        this.actionDef = Action.factory.serialize(
          typeof this.action === 'string' ? {key: this.action} : this.action
        );
      }
      catch (err) { console.error(err); }
    if (!this.actionDef) return;
    this.icon = fromStringPipe(this.actionDef.icon, this.target);
    this.text = fromStringPipe(this.actionDef.text, this.target);
  }

  /** Emits a event action. */
  emitEvent(nativeEvent: any) {
    this.event.emit(new ActionEvent(this.actionDef, nativeEvent, this.target));
  }
}
