import { Optional } from '@angular/core';
import { Map, isCollection } from 'immutable';

import Area from './area';
import AreaFactory from './area_factory';
import Control from './control';
import ControlRef, { ITM_CONTROL_REF } from './control_ref';
import FormRef from './form_ref';
import FieldFactory from './field_factory';
import Target from './target';
import { isEnumIncludes } from './utils';

export function ItmControlFactory(): AreaFactory<Control, Control.Config>;
export function ItmControlFactory(...cfgs: Partial<Control.Config>[]): Control;
// tslint:disable-next-line:max-line-length
export function ItmControlFactory(...cfgs: Partial<Control.Config>[]): Control | AreaFactory<Control, Control.Config> {
  if (!cfgs.length) return ItmControlFactory._static;
  return ItmControlFactory._static.serialize(...cfgs);
}

export module ItmControlFactory {
  export function normalize(cfg: Control.ModelConfig): Control.Model {
    // tslint:disable-next-line:max-line-length
    if (cfg.type && !isEnumIncludes(Control.Type, cfg.type)) throw new TypeError('Expected control type');
    return {
      type: cfg.type || Control.Type.string,
      pattern: cfg.pattern instanceof RegExp ? cfg.pattern : null,
      required: typeof cfg.required === 'boolean' ? cfg.required : false,
      max: typeof cfg.max === 'number' ? cfg.max || 0 : null,
      min: typeof cfg.min === 'number' ? cfg.min || 0 : null,
      enum: isCollection(cfg.enum) ? cfg.enum : null,
      validator: cfg.validator ? Target.defer(Object, cfg.validator) : null
    };
  }

  export const _static: AreaFactory<Control, Control.Config> = FieldFactory().extend({
    selector: Control.selector,
    normalize,
    model: {
      type: null,
      pattern: null,
      required: null,
      min: null,
      max: null,
      enum: null,
      validator: null
    },
    shared: new AreaFactory.Shared({
      defaultComp: opts => opts.defaultControlComp,
      providers: Map<any, Area.Provider>().set(
        ITM_CONTROL_REF,
        {deps: [Area, Target, [new Optional(), FormRef]], useFactory: ControlRef.provide}
      )
    })
  });
}

export default ItmControlFactory;
