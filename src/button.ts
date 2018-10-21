import { Injectable, Inject } from '@angular/core';
import { Map, RecordOf } from 'immutable';

import Area from './area';
import Target from './target';
import { empty, Observable, of } from 'rxjs';

/** A generic action configuration. */
interface ItmButtonConfig<T extends Object = {}> {
  /** The identifier of the actions. */
  key?: string;

  /** Defines the action icon. */
  icon?: false | Target.PipeLike<T, string>;

  /** Defines the the text. */
  text?: false | Target.PipeLike<T, string>;

  /** Pipe to disable the action */
  disabled?: Target.PipeLike<T, boolean>;

  /** Defines the mode of the button */
  mode?: Target.PipeLike<T, ItmButton.Mode>;
}

export type ItmButton<T = {}> = Area<T> & RecordOf<ItmButton.Model<T>>;

export module ItmButton {
  export enum Mode {
    basic = 'BASIC',
    icon = 'ICON',
    menu = 'MENU',
    raised = 'RAISED',
    stroked = 'STROKED'
  }

  export type ModelConfig<T = {}> = ItmButtonConfig<T>;

  export interface Model<T = {}> extends ModelConfig<T> {
    icon: Target.Pipe<T, string> | null;
    disabled: Target.Pipe<T, boolean> | null;
    mode: Target.Pipe<T, Mode> | null;
  }

  const serializer = (cfg: RecordOf<ModelConfig>): Model => {
    if (!cfg.key || typeof cfg.key !== 'string') throw new TypeError('Expected key');
    const key = cfg.key;
    const icon = cfg.icon === false ? (() => empty()) : Target.defer('string', cfg.icon || key);
    const disabled = Target.defer('boolean', cfg.disabled);
    const mode = Target.defer(Mode, cfg.mode);
    return {key, icon, mode, disabled};
  };

  const selector = 'button';

  export type Config<T extends Object = {}> = Area.Config<T> & ModelConfig<T>;


  @Injectable()
  export class Ref {
    readonly icon: Observable<string>;
    readonly disabled: Observable<boolean>;
    readonly mode: Observable<Mode>;

    constructor(@Inject(Area) button: ItmButton, target: Target) {
      this.icon = button.icon ? Target.map(target, button.icon) : empty();
      this.disabled = button.disabled ? Target.map(target, button.disabled) : empty();
      this.mode = button.mode ? Target.map(target, button.mode) : of(Mode.basic);
    }
  }

  export const factory: Area.Factory<ItmButton, Config> = Area.factory.extend({
    selector,
    serializer,
    model: {key: null, icon: null, disabled: null, mode: null},
    shared: new Area.Shared({
      providers: Map<any, Area.Provider>().set(Ref, {useClass: Ref})
    })
  });
}

export default ItmButton;
