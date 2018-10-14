import { InjectionToken } from '@angular/core';
import { RecordOf } from 'immutable';

import { ItmPipeLike } from './item';
import RecordFactory from './record-factory';

/** A generic action configuration. */
interface ItmActionConfig<T = {}> {
  /** The identifier of the actions. */
  key: string;
  /** Defines the action icon. */
  icon?: false | ItmPipeLike<T, string>;
  /** Defines the the text. */
  text?: false | ItmPipeLike<T, string>;
}

export type ItmAction<T = {}> = RecordOf<ItmAction.Model<T>>;

export module ItmAction {
  export type Config<T = {}> = ItmActionConfig<T>;

  export interface Model<T = {}> extends Config<T> {
    key: string;
    icon: ItmPipeLike<T, string>;
    text: ItmPipeLike<T, string>;
  }

  const serializer = (cfg: RecordOf<Config>): Model => {
    if (!cfg.key || typeof cfg.key !== 'string') throw new TypeError('Expected key');
    const key = cfg.key;
    const icon = cfg.icon === false ? null : cfg.icon || key;
    const text = cfg.text === false ? null : cfg.text || key;
    return {key, icon, text};
  };

  const selector = 'action';

  export const factory: RecordFactory<ItmAction, Config> = RecordFactory.build({
    selector,
    serializer,
    model: {key: null, icon: null, text: null}
  });

  export const SET_TOKEN = new InjectionToken('ITM_ACTION_SET_TOKEN');
  export const RECORD_TOKEN = new InjectionToken('ITM_ACTION_RECORD_TOKEN');
  export const BUTTON_MODE_TOKEN = new InjectionToken('ITM_ACTION_BUTTON_MODE_TOKEN');
}

export default ItmAction;
