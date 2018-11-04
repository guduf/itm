import { Map } from 'immutable';

import AreaFactory from './area_factory';
import Area from './area';
import ActionEmitter from './action_emitter';
import Target from './target';
import Button, { ItmButtonRef } from './button';
import ButtonArea from './button_area';
import ButtonFactory from './button_factory';

// tslint:disable-next-line:max-line-length
export function ItmButtonAreaFactory(): AreaFactory<ButtonArea, ButtonArea.Config>;
// tslint:disable-next-line:max-line-length
export function ItmButtonAreaFactory(...cfgs: Partial<ButtonArea.Config>[]): ButtonArea;
// tslint:disable-next-line:max-line-length
export function ItmButtonAreaFactory(...cfgs: Partial<ButtonArea.Config>[]): ButtonArea | AreaFactory<ButtonArea, ButtonArea.Config> {
  if (!cfgs.length) return ItmButtonAreaFactory._static;
  return ItmButtonAreaFactory._static.serialize(...cfgs);
}

export module ItmButtonAreaFactory {
  const model = {key: null, action: null, icon: null, disabled: null, mode: null, text: null};

  export const _static: AreaFactory<ButtonArea, ButtonArea.Config> = AreaFactory().extend({
    selector: Button.selector,
    normalize: ButtonFactory.normalize,
    model,
    shared: new AreaFactory.Shared({
      defaultComp: cfg => cfg.defaultButtonComp,
      providers: Map<any, Area.Provider>()
        .set(ItmButtonRef, {deps: [Area, Target, ActionEmitter], useClass: ItmButtonRef})
    })
  });
}

export default ItmButtonAreaFactory;
