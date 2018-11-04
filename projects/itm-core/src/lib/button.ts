import { RecordOf } from 'immutable';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import ActionEmitter from './action_emitter';
import RecordFactory from './record_factory';
import Target from './target';

/** A button area configuration. */
export interface ItmButtonConfig<T extends Object = {}> {
  key?: string;

  action?: string;

  /** Defines the action icon. If false, text is never displayed. */
  icon?: false | Target.PipeLike<T, string>;

  /** The text attached to the button. */
  text?: Target.PipeLike<T, string> | false;

  /** Whether the button is disabled */
  disabled?: Target.PipeLike<T, boolean>;

  /** The display mode of the button */
  mode?: Target.PipeLike<T, ItmButton.Mode>;
}

export class ItmButtonRef {
  readonly icon: Observable<string>;
  readonly disabled: Observable<boolean>;
  readonly mode: Observable<ItmButton.Mode>;
  readonly text: Observable<string>;
  readonly emit: (nativeEvent?: any) => void;

  constructor(
    button: ItmButton,
    target: Target,
    emitter: ActionEmitter
  ) {
    this.icon = button.icon ? Target.map(target, button.icon) : of(button.key);
    this.disabled = emitter.resolvers.pipe(
      mergeMap(resolvers => (
        resolvers.get(button.key) === null ? of(true) :
        button.disabled ? Target.map(target, button.disabled) :
          of(false)
      ))
    );
    this.emit = (nativeEvent?: any) => emitter.emit(button.action, nativeEvent);
    this.mode = button.mode ? Target.map(target, button.mode) : of(ItmButton.Mode.basic);
    this.text = button.text ? Target.map(target, button.text) : of(button.key);
  }
}

/** Record that describes specifics property of a button area. */
export type ItmButton<T extends Object = {}> = RecordOf<ItmButton.Model<T>>;

export module ItmButton {
  /** The availables display mode for a button. */
  export enum Mode {
    basic = 'BASIC',
    icon = 'ICON',
    menu = 'MENU'
  }

  export type Config<T = {}> = ItmButtonConfig<T>;

  export interface Model<T = {}> extends Config<T> {
    key: string;
    action: string;
    icon: Target.Pipe<T, string> | null;
    disabled: Target.Pipe<T, boolean> | null;
    mode: Target.Pipe<T, Mode> | null;
    text: Target.Pipe<T, string> | false;
  }

  export const selector = 'button';
  export const keyPattern = `\\$?${RecordFactory.selectorPattern}`;
  export const keyRegExp = new RegExp(`^${keyPattern}$`);
}

export default ItmButton;
