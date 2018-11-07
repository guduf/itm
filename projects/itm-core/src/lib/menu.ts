import { Map, RecordOf } from 'immutable';
import { Observable, of } from 'rxjs';

import Area from './area';
import Action from './action';
import ActionEmitter from './action_emitter';
import Button, { ItmButtonRef as ButtonRef } from './button';
import Target from './target';

export class ItmMenuRef<A extends Action<T> = Action<T>, T extends Object = {}> {
  readonly buttons: Map<string, ButtonRef>;
  readonly direction: Observable<ItmMenu.Direction>;
  readonly mode: Observable<Button.Mode>;

  constructor(
    menu: ItmMenu<T>,
    target: Target<T>,
    emitter: ActionEmitter<A>
  ) {
    this.buttons = menu.buttons.map(button => new ButtonRef(button, target, emitter));
    this.direction = Target.map(target, menu.direction || (() => of(ItmMenu.Direction.right)));
    this.mode = Target.map(target, menu.mode || (() => of(Button.Mode.basic)));
  }
}

/** Record that describes specifics property of a menu area. */
export type ItmMenu<T = {}> = Area<T> & RecordOf<ItmMenu.Model<T>>;

export module ItmMenu {
  export enum Direction {
    top = 'top',
    right = 'right',
    bottom = 'bottom',
    left = 'left'
  }

  export interface ModelConfig<T extends Object = {}> {
    buttons?: Button.Config<T>[] | Map<string, Button.Config<T>>;
    direction?: Target.PipeLike<T, Direction>;
    mode?: Target.PipeLike<T, Button.Mode>;
  }

  export interface Model<T = {}> extends ModelConfig<T> {
    buttons: Map<string, Button<T>>;
    mode: Target.Pipe<T, Button.Mode>;
    direction: Target.Pipe<T, Direction>;
  }

  export type Config<T extends Object = {}> = Area.Config<T> & ModelConfig<T>;

  export const selector = 'menu';
}

export default ItmMenu;
