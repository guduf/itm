import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';

import { ItmAreaText } from './area';
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
  readonly disabled: Observable<boolean>;

  readonly icon: Observable<string>;

  readonly mode: Observable<Button.Mode>;

  readonly modes = Button.Mode;

  readonly text: Observable<string>;

  constructor(
    areaText: ItmAreaText,
    buttonRef: ItmButtonRef
  ) {
    this.disabled = buttonRef.disabled;
    this.mode = buttonRef.mode;
    this.icon = buttonRef.icon.pipe(
      combineLatest(this.mode),
      map(([icon, mode]) => MODES_WITH_ICON.includes(mode) ? icon : null)
    );
    this.text = areaText.pipe(
      combineLatest(this.mode),
      map(([text, mode]) => MODES_WITH_TEXT.includes(mode) ? text : null),
    );
  }

  emit(e: MouseEvent) {
    // TO BE IMPLEMENTED
  }
}
