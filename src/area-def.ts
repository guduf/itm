import { StaticProvider } from '@angular/core';
import { of } from 'rxjs';

import { Itm, ItmPipe, ItmPipeLike, deferPipe, ItmTarget } from './item';
import { ComponentType, isComponentType } from './utils';
import { ItmAreaConfig, ItmPropAreaConfig } from './area-config';

/** The definition of a column used by ItmTableComponent */
export class ItmAreaDef<T = {}> implements ItmAreaConfig<T> {
  /** see [[ItmAreaConfig.key]]. */
  readonly key: string;
  /** see [[ItmAreaConfig.size]]. */
  readonly size: number;
  /** see [[ItmAreaConfig.grow]]. */
  readonly grow: number;
  /** see [[ItmAreaConfig.cell]]. */
  readonly cell: ComponentType;

  /** The cell observable used by default components. */
  readonly defaultText?: ItmPipe<T, string>;

  readonly providers: StaticProvider[] = [];

  constructor(cfg: ItmAreaConfig<T>) {
    if (cfg.key && typeof cfg.key === 'string') this.key = cfg.key;
    // tslint:disable-next-line:max-line-length
    else throw new TypeError('InvalidItmAreaConfig : Expected [key] as string for ItmAreaConfig');
    this.size = cfg.size && typeof cfg.size === 'number' ? cfg.size : 2;
    this.grow = cfg.grow && typeof cfg.grow === 'number' ? cfg.grow : 0;
    this.cell = isComponentType(cfg.cell) ? cfg.cell as ComponentType : null;
    if (!this.cell && cfg.cell !== false) (
      this.defaultText = (
        typeof cfg.cell !== 'function' ? () => of(this.key) :
          deferPipe(cfg.cell as ItmPipeLike<T, string>)
      )
    );
    this.providers = [...(cfg.providers || [])];
  }

  getProviders(target: T): StaticProvider[] {
    return [
      ...this.providers,
      {provide: ItmTarget, useValue: target}
    ];
  }
}

/** The definition of a column used by ItmTableComponent */
// tslint:disable-next-line:max-line-length
export class ItmPropAreaDef<I extends Itm = Itm> extends ItmAreaDef<I> implements ItmPropAreaConfig<I> {
  /** see [[ItmAreaConfig.key]]. */
  readonly key: string & keyof I;

  /** see [[ItmAreaConfig.header]]. */
  readonly header: ComponentType;

  /** see [[ItmAreaConfig.label]]. */
  readonly label: ComponentType;

  /** The header observable used by default components. */
  readonly defaultHeader?: ItmPipe<I[], string>;

  /** The label observable used by default components. */
  readonly defaultLabel?: ItmPipe<I, string>;

  /** The cell observable used by default components. */
  readonly defaultText?: ItmPipe<I, string>;

  constructor(cfg: ItmPropAreaConfig<I>) {
    super(cfg);
    if (!this.cell && cfg.cell !== false) (
      this.defaultText = (
        !cfg.cell ? item => of(item[this.key]) :
        typeof cfg.cell === 'string' ? item => of(item[cfg.cell as string]) :
          deferPipe(cfg.cell as ItmPipeLike<I, string>)
      )
    );
    this.label = isComponentType(cfg.label) ? cfg.label as ComponentType : null;
    if (!this.label && cfg.label !== false) (
      this.defaultLabel = (
        !cfg.label ? () => of(this.key) :
        typeof cfg.label === 'string' ? () => of(cfg.label as string) :
          deferPipe(cfg.label as ItmPipeLike<I, string>)
      )
    );
    this.header = isComponentType(cfg.header) ? cfg.header as ComponentType : null;
    if (!this.header && cfg.header !== false) (
      this.defaultHeader = (
        !cfg.header ? () => of(this.key) :
        typeof cfg.header === 'string' ? () => of(cfg.header as string) :
          deferPipe(cfg.header as ItmPipeLike<I[], string>)
      )
    );
  }
}
