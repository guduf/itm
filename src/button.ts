import { Injectable, Inject } from '@angular/core';
import { Map, RecordOf } from 'immutable';
import { empty, Observable, of } from 'rxjs';

import Area from './area';
import Target from './target';

/** A button area configuration. */
interface ItmButtonConfig<T extends Object = {}> {
  /** Defines the action icon. If false, text is never displayed. */
  icon?: false | Target.PipeLike<T, string>;

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

  constructor(
    @Inject(Area)
    button: ItmButton,
    target: Target
  ) {
    this.icon = button.icon ? Target.map(target, button.icon) : empty();
    this.disabled = button.disabled ? Target.map(target, button.disabled) : empty();
    this.mode = button.mode ? Target.map(target, button.mode) : of(ItmButton.Mode.basic);
  }
}

/** Record that describes specifics property of a button area. */
export type ItmButton<T = {}> = Area<T> & RecordOf<ItmButton.Model<T>>;

export module ItmButton {
  /** The availables display mode for a button. */
  export enum Mode {
    basic = 'BASIC',
    icon = 'ICON',
    menu = 'MENU'
  }

  export type ModelConfig<T = {}> = ItmButtonConfig<T>;

  export interface Model<T = {}> extends ModelConfig<T> {
    icon: Target.Pipe<T, string> | null;
    disabled: Target.Pipe<T, boolean> | null;
    mode: Target.Pipe<T, Mode> | null;
  }

  const serializer = (cfg: RecordOf<ModelConfig>, {key}: Area): Model => {
    const icon = cfg.icon === false ? (() => empty()) : Target.defer('string', cfg.icon || key);
    const disabled = Target.defer('boolean', cfg.disabled);
    const mode = Target.defer(Mode, cfg.mode);
    return {icon, mode, disabled};
  };

  const selector = 'button';

  export type Config<T extends Object = {}> = Area.Config<T> & ModelConfig<T>;

  export const factory: Area.Factory<ItmButton, Config> = Area.factory.extend({
    selector,
    serializer,
    model: {icon: null, disabled: null, mode: null},
    shared: new Area.Shared({
      defaultComp: cfg => cfg.defaultButtonComp,
      providers: Map<any, Area.Provider>()
        .set(ItmButtonRef, {deps: [Area, Target], useClass: ItmButtonRef})
    })
  });
}

export default ItmButton;
