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
  /** Whether the button is disabled. */
  readonly disabled: Observable<boolean>;

  /** The icon to display. If null, none icon is displayed. */
  readonly icon: Observable<string>;

  /** The display mode of the button. */
  readonly mode: Observable<Button.Mode>;

  /** All availables display modes. */
  readonly modes = Button.Mode;

  /** The text to display. If null, none text is displayed. */
  readonly text: Observable<string>;

  constructor(
    buttonRef: ItmButtonRef
  ) {
    this.disabled = buttonRef.disabled;
    this.mode = buttonRef.mode;
    this.icon = buttonRef.icon.pipe(
      combineLatest(this.mode),
      map(([icon, mode]) => MODES_WITH_ICON.includes(mode) ? icon : null)
    );
    this.text = buttonRef.text.pipe(
      combineLatest(this.mode),
      map(([text, mode]) => MODES_WITH_TEXT.includes(mode) ? text : null),
    );
  }

  /** Emits a action event. */
  emit(e: MouseEvent) {
    // TO BE IMPLEMENTED
  }
}
