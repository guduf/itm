import { Injectable, Inject } from '@angular/core';
import { Map, RecordOf } from 'immutable';
import { empty, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, mergeMap } from 'rxjs/operators';

import ItmArea from './area';
import ActionEmitter from './action-emitter';
import RecordFactory from './record-factory';
import Target from './target';

/** A button area configuration. */
interface ItmButtonConfig<T extends Object = {}> {
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

@Injectable()
export class ItmButtonRef {
  readonly icon: Observable<string>;
  readonly disabled: Observable<boolean>;
  readonly mode: Observable<ItmButton.Mode>;
  readonly text: Observable<string>;
  readonly emit: (nativeEvent?: any) => void;

  constructor(
    @Inject(ItmArea)
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

  const serializer = (cfg: RecordOf<AreaConfig>): Model => {
    if (!cfg.key || !keyRegExp.test(cfg.key)) throw new TypeError('Expected key');
    const key = cfg.key;
    const action = cfg.action && keyRegExp.test(cfg.action) ? cfg.action : key;
    const icon = (
      cfg.icon === false ? () => empty() :
      cfg.icon ? Target.defer('string', cfg.icon || key) :
        null
    );
    const disabled = Target.defer('boolean', cfg.disabled);
    const mode = Target.defer(Mode, cfg.mode);
    const text: Target.Pipe<{}, string> = (
      cfg.text === false ? () => empty() :
      cfg.text ? Target.defer('string', cfg.text) :
        null
    );
    return {key, action, icon, mode, disabled, text};
  };

  const selector = 'button';

  const model = {key: null, action: null, icon: null, disabled: null, mode: null, text: null};

  export const factory: RecordFactory<ItmButton, Config> = RecordFactory.build({
    selector,
    serializer,
    model
  });

  export type AreaConfig<T extends Object = {}> = ItmArea.Config<T> & Config<T>;

  export type Area<T = {}> = ItmArea<T> & RecordOf<Model<T>>;

  export const areaFactory: ItmArea.Factory<Area, AreaConfig> = ItmArea.factory.extend({
    selector,
    serializer,
    model,
    shared: new ItmArea.Shared({
      defaultComp: cfg => cfg.defaultButtonComp,
      providers: Map<any, ItmArea.Provider>()
        .set(ItmButtonRef, {deps: [ItmArea, Target, ActionEmitter], useClass: ItmButtonRef})
    })
  });

  export const keyPattern = `\\$?${RecordFactory.selectorPattern}`;
  export const keyRegExp = new RegExp(`^${keyPattern}$`);
}

export default ItmButton;
