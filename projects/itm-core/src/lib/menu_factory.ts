import { Map } from 'immutable';

import ActionEmitter from './action_emitter';
import Area from './area';
import AreaFactory from './area_factory';
import Button from './button';
import ButtonFactory from './button_factory';
import Menu, { ItmMenuRef } from './menu';
import Target from './target';
import { ItmButtonRef } from './button';
import { parseIter } from './utils';

export function ItmMenuFactory(): AreaFactory<Menu, Menu.Config>;
export function ItmMenuFactory(...cfgs: Partial<Menu.Config>[]): Menu;
// tslint:disable-next-line:max-line-length
export function ItmMenuFactory(...cfgs: Partial<Menu.Config>[]): Menu | AreaFactory<Menu, Menu.Config> {
  if (!cfgs.length) return ItmMenuFactory._static;
  return ItmMenuFactory._static.serialize(...cfgs);
}

export module ItmMenuFactory {
  export function normalize(cfg: Menu.ModelConfig): Menu.Model {
    const buttonCfgs: Button.Config[] = (
      Array.isArray(cfg.buttons) ? cfg.buttons :
      Map.isMap(cfg.buttons) ? cfg.buttons.valueSeq().toArray() :
        []
    );
    const buttons = parseIter(buttonCfgs, 'key', btnCfg => ButtonFactory(btnCfg));
    const mode = cfg.mode ? Target.defer(Button.Mode, cfg.mode) : null;
    const direction = cfg.direction ? Target.defer(Menu.Direction, cfg.direction) : null;
    return {buttons, mode, direction};
  }

  export function provideMenuRef(
    menu: Menu,
    target: Target,
    emitter: ActionEmitter
  ): ItmMenuRef {
    return new ItmMenuRef(
      Target.map(target, menu.direction),
      menu.buttons.map(button => new ItmButtonRef(button, target, emitter))
    );
  }

  export const _static: AreaFactory<Menu, Menu.Config> = AreaFactory().extend({
    selector: Menu.selector,
    normalize,
    model: {buttons: null, mode: null, direction: null},
    shared: new AreaFactory.Shared({
      defaultComp: opts => opts.defaultMenuComp,
      providers: Map<any, Area.Provider>()
        .set(ItmMenuRef, {deps: [Area, Target, ActionEmitter], useFactory: provideMenuRef})
    })
  });
}

export default ItmMenuFactory;
