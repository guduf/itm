import { StaticProvider } from '@angular/core';

import { ItmPipe, ItmPipeLike, deferPipe, ITM_TARGET } from './item';
import { ComponentType, isComponentType } from './utils';
import { ItmAreaConfig } from './area-config';
import { Record, RecordOf, Map, mergeDeep, Collection, isKeyed, Stack, List } from 'immutable';
import { ItmConfig } from './config';

/** The definition of a column used by ItmTableComponent */
export class ItmArea<T = {}> implements ItmAreaConfig<T> {
  /** see [[ItmAreaConfig.key]]. */
  readonly key: string;
  /** see [[ItmAreaConfig.size]]. */
  readonly size: number;
  /** see [[ItmAreaConfig.grow]]. */
  readonly grow: number;
  /** see [[ItmAreaConfig.cell]]. */
  readonly cell?: ComponentType;

  readonly text?: ItmPipeLike<T, string>;

  readonly providers: Map<any, any>;

  constructor(cfg: string | ItmAreaConfig<T>) {
    if (typeof cfg === 'string') (cfg = {key: cfg});
    if (cfg.key && typeof cfg.key === 'string') this.key = cfg.key;
    // tslint:disable-next-line:max-line-length
    else throw new TypeError('InvalidItmAreaConfig : Expected [key] as string for ItmAreaConfig');
    this.size = cfg.size && typeof cfg.size === 'number' ? cfg.size : 1;
    this.grow = cfg.grow && typeof cfg.grow === 'number' ? cfg.grow : 1;
    this.cell = cfg.cell !== false && isComponentType(cfg.cell) ? cfg.cell as ComponentType : null;
    this.text = (
      typeof cfg.text  === 'function' ? cfg.text :
      !this.cell && typeof cfg.cell === 'function' ? cfg.cell as ItmPipeLike<T, string> :
      null
    );
    this.providers = (
      Map.isMap(cfg.providers) ? cfg.providers :
      !Array.isArray(cfg.providers) ? Map() :
        cfg.providers
          .map(providerCfg => {
            const providerClc: Collection<any, any> = Collection(providerCfg);
            const keyed = isKeyed(providerClc);
            const providerKey = providerClc.get(keyed ? 'provider' : 0, null);
            const providerValue = providerClc.get(keyed ? 'useValue' : 1, null);
            if (!providerKey || !providerValue) throw new TypeError('Expected provider config');
            return [providerKey, providerValue];
          })
          .reduce((acc, [key, val]) => acc.set(key, val), Map<any, any>())
    );
  }
}

export const AREA_ROOT_SELECTOR = 'area';
export const AREA_SELECTOR_PATTERN = '[a-z]\\w+';
// tslint:disable-next-line:max-line-length
export const AREA_SELECTOR_REGEXP = new RegExp(`^${AREA_ROOT_SELECTOR}(:${AREA_SELECTOR_PATTERN})*$`);
// tslint:disable-next-line:max-line-length
export const AREA_SELECTOR_SUFFIX_REGEXP = new RegExp(`^${AREA_SELECTOR_PATTERN}(:${AREA_SELECTOR_PATTERN})*$`);
