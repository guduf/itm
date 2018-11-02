import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';

import Button, { ItmButtonRef } from './button';

const MODES_WITH_ICON = [
  Button.Mode.icon
];

const MODES_WITH_TEXT = [
  Button.Mode.basic,
  Button.Mode.menu
];

@Component({
  selector: 'itm-button',
  templateUrl: 'button.component.html'
})
export class ItmButtonComponent {

  /** The icon to display. If null, none icon is displayed. */
  readonly icon: Observable<string>;

  /** All availables display modes. */
  readonly modes = Button.Mode;

  /** The text to display. If null, none text is displayed. */
  readonly text: Observable<string>;

  /** Handles click events to action emitter. */
  get emit(): (nativeEvent: MouseEvent) => void { return this._buttonRef.emit; }

  /** Whether the button is disabled. */
  get disabled(): Observable<boolean> { return this._buttonRef.disabled; }

  /** The display mode of the button. */
  get mode(): Observable<Button.Mode> { return this._buttonRef.mode; }

  constructor(
    private readonly _buttonRef: ItmButtonRef
  ) {
    this.icon = _buttonRef.icon.pipe(
      combineLatest(this.mode),
      map(([icon, mode]) => MODES_WITH_ICON.includes(mode) ? icon : null)
    );
    this.text = _buttonRef.text.pipe(
      combineLatest(this.mode),
      map(([text, mode]) => MODES_WITH_TEXT.includes(mode) ? text : null),
    );
  }
}
