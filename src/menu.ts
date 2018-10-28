import { Map, RecordOf } from 'immutable';

import Area from './area';
import Button from './button';
import Target from './target';
import { InjectionToken } from '@angular/core';
import { ItmButtonRef } from './button';

// tslint:disable-next-line:max-line-length
export const ITM_MENU_BUTTON_REFS = new InjectionToken<Map<string, ItmButtonRef>>('ITM_MENU_BUTTON_REFS');

/** Record that describes specifics property of a button area. */
export type ItmMenu<T = {}> = Area<T> & RecordOf<ItmMenu.Model<T>>;

export module ItmMenu {
  export interface ModelConfig<T extends Object = {}> {
    buttons: Button.Config<T>[] | Map<string, Button.Config<T>>;
    mode: Target.PipeLike<T, Button.Mode>;
  }

  export interface Model<T = {}> extends ModelConfig<T> {
    buttons: Map<string, Button<T>>;
    mode: Target.Pipe<T, Button.Mode>;
  }

  const serializer = (cfg: RecordOf<ModelConfig>): Model => {
    const buttonCfgs: Button.Config[] = (
      Array.isArray(cfg.buttons) ? cfg.buttons :
      Map.isMap(cfg.buttons) ? cfg.buttons.valueSeq().toArray() :
        []
    );
    const buttons = buttonCfgs.reduce(
      (acc, buttonCfg) => {
        const button = Button.factory.serialize(buttonCfg);
        return acc.set(button.key, button);
      },
      Map<string, Button>()
    );
    const mode = Target.defer(Button.Mode, cfg.mode);
    return {buttons, mode};
  };

  const selector = 'menu';

  export type Config<T extends Object = {}> = Area.Config<T> & ModelConfig<T>;

  export function provideButtonRefs(menu: ItmMenu, target: Target): Map<string, ItmButtonRef> {
    return menu.buttons.map(button => new ItmButtonRef(button, target));
  }

  export const factory: Area.Factory<ItmMenu, Config> = Area.factory.extend({
    selector,
    serializer,
    model: {buttons: null, mode: null},
    shared: new Area.Shared({
      defaultComp: cfg => cfg.defaultMenuComp,
      providers: Map<any, Area.Provider>()
        .set(ITM_MENU_BUTTON_REFS, {deps: [Area, Target], useFactory: provideButtonRefs})
    })
  });
}

export default ItmMenu;
