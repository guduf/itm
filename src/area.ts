import { StaticProvider } from '@angular/core';

import { ItmPipe, ItmPipeLike, deferPipe, ITM_TARGET } from './item';
import { ComponentType, isComponentType } from './utils';
import { ItmAreaConfig } from './area-config';

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

  readonly text?: ItmPipe<T, string>;

  /** The cell observable used by default components. */
  readonly defaultCell?: ComponentType;

  /** The cell observable used by default components. */
  readonly defaultText?: ItmPipe<T, string>;

  readonly providers: StaticProvider[] = [];

  constructor(
    cfg: string | ItmAreaConfig<T>,
    defaults: { cell?: ComponentType, text?: ItmPipe<T, string> } = {}
  ) {
    if (typeof cfg === 'string') (cfg = {key: cfg});
    if (cfg.key && typeof cfg.key === 'string') this.key = cfg.key;
    // tslint:disable-next-line:max-line-length
    else throw new TypeError('InvalidItmAreaConfig : Expected [key] as string for ItmAreaConfig');
    this.size = cfg.size && typeof cfg.size === 'number' ? cfg.size : 2;
    this.grow = cfg.grow && typeof cfg.grow === 'number' ? cfg.grow : 0;
    this.cell = cfg.cell !== false && isComponentType(cfg.cell) ? cfg.cell as ComponentType : null;
    this.text = (
      typeof cfg.text  === 'function' ? deferPipe(cfg.text) :
      !this.cell && typeof cfg.cell === 'function' ? deferPipe(cfg.cell as ItmPipeLike<T, string>) :
      null
    );
    this.defaultCell = isComponentType(defaults.cell) ? defaults.cell : null;
    this.defaultText = (
      typeof defaults.text === 'function' ? deferPipe(defaults.text) : null
    );
    this.providers = [...(cfg.providers || [])];
  }

  getProviders(target: T): StaticProvider[] {
    return [
      ...this.providers,
      {provide: ITM_TARGET, useValue: target}
    ];
  }
}
