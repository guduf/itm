import { Map, RecordOf } from 'immutable';

import ActionEmitter from './action-emitter';
import Area from './area';
import Button from './button';
import Target from './target';
import { ItmButtonRef } from './button';
import { Observable } from 'rxjs';

export class ItmMenuRef {
  constructor(
    readonly direction: Observable<ItmMenu.Direction>,
    readonly buttons: Map<string, ItmButtonRef>
  ) { }
}

/** Record that describes specifics property of a button area. */
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
    mode?: Target.PipeLike<T, Button.Mode>;
    direction?: Target.PipeLike<T, Direction>;
  }

  export interface Model<T = {}> extends ModelConfig<T> {
    buttons: Map<string, Button<T>>;
    mode: Target.Pipe<T, Button.Mode>;
    direction: Target.Pipe<T, Direction>;
  }

  const serializer = (cfg: RecordOf<ModelConfig>): Model => {
    const buttonCfgs: Button.Config[] = (
      Array.isArray(cfg.buttons) ? cfg.buttons :
      Map.isMap(cfg.buttons) ? cfg.buttons.valueSeq().toArray() :
        []
    );
    const buttons = buttonCfgs.reduce(
      (acc, buttonCfg) => {
        console.log(buttonCfg);
        const button = Button.factory.serialize(buttonCfg);
        return acc.set(button.key, button);
      },
      Map<string, Button>()
    );
    const mode = Target.defer(Button.Mode, cfg.mode);
    const direction = Target.defer(Direction, cfg.direction);
    return {buttons, mode, direction};
  };

  const selector = 'menu';

  export type Config<T extends Object = {}> = Area.Config<T> & ModelConfig<T>;

  export function provideMenuRef(
    menu: ItmMenu,
    target: Target,
    emitter: ActionEmitter
  ): ItmMenuRef {
    return new ItmMenuRef(
      Target.map(target, menu.direction),
      menu.buttons.map(button => new ItmButtonRef(button, target, emitter))
    );
  }

  export const factory: Area.Factory<ItmMenu, Config> = Area.factory.extend({
    selector,
    serializer,
    model: {buttons: null, mode: null, direction: null},
    shared: new Area.Shared({
      defaultComp: cfg => cfg.defaultMenuComp,
      providers: Map<any, Area.Provider>()
        .set(ItmMenuRef, {deps: [Area, Target, ActionEmitter], useFactory: provideMenuRef})
    })
  });
}

export default ItmMenu;
