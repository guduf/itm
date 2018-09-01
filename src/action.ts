import { ItmPipeLike, ItmPipe, deferPipe } from './item';
import { InjectionToken } from '@angular/core';

/** The token for display mode for row actions buttons */
export const ITM_TABLE_ACTIONS_BUTTONS_MODE = new InjectionToken('ITM_TABLE_ACTIONS_BUTTONS_MODE');

export interface ItmActionConfig<T = {}> {
  /** The identifier of the actions */
  key: string;
  /** Defines the action icon. */
  icon?: false | ItmPipeLike<T, string>;
  /** Defines the the text */
  text?: ItmPipeLike<T, string>;
}

export class ItmActionDef<T = {}> implements ItmActionConfig {
  /** see [[ItmActionConfig.key]] */
  key: string;
  /** see [[ItmActionConfig.icon]] */
  icon: ItmPipe<T, string>;
  /** see [[ItmActionConfig.text]] */
  text: ItmPipe<T, string>;

  constructor(cfg: ItmActionConfig) {
    if (cfg.key && typeof cfg.key === 'string') this.key = cfg.key;
    else throw new TypeError('InvalidItmActionConfig : Expected [key] as string for event config');
    this.icon = cfg.icon === false ? null : deferPipe(cfg.icon || this.key);
    this.text = deferPipe(cfg.text || this.key);
  }
}

export abstract class ItmActionDefs extends Array<ItmActionDef> { }

export class ItmActionEvent<T = {}> {
  /** The key of the action */
  readonly key: string;

  constructor(
    readonly action: ItmActionDef,
    readonly nativeEvent: any,
    readonly target: T = {} as T
  ) {
    if (action instanceof ItmActionDef) this.key = action.key;
    else throw new TypeError('ItmActionEvent : Expected (action) as ItmActionDef');
    if (!nativeEvent) throw new TypeError('ItmActionEvent : Expected (nativeEvent)');
  }
}

