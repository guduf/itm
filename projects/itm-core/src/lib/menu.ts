import { Map, RecordOf } from 'immutable';
import { Observable } from 'rxjs';

import Area from './area';
import Button from './button';
import Target from './target';
import { ItmButtonRef } from './button';

/** Record that describes specifics property of a button area. */
export type ItmMenu<T = {}> = Area<T> & RecordOf<ItmMenu.Model<T>>;

export class ItmMenuRef {
  constructor(
    readonly direction: Observable<ItmMenu.Direction>,
    readonly buttons: Map<string, ItmButtonRef>
  ) { }
}

export module ItmMenu {
  export enum Direction {
    top = 'top',
    right = 'right',
    bottom = 'bottom',
    left = 'left'
  }

  export interface ModelConfig<T extends Object = {}> {
    buttons?: Button.Config<T>[] | Map<string, Button.Config<T>>;
    mode?: Target.PipeLike<T, Button.Mode>;
    direction?: Target.PipeLike<T, Direction>;
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
