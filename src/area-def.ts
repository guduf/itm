import { StaticProvider } from '@angular/core';
import { of } from 'rxjs';

import { Itm, ItmPipe, ItmPipeLike, deferPipe } from './item';
import { ComponentType, isComponentType } from './utils';
import { ItmAreaConfig } from './area-config';

/** The definition of a column used by ItmTableComponent */
export class ItmAreaDef<I extends Itm = Itm> implements ItmAreaConfig {
  /** see [[ItmAreaConfig.key]]. */
  readonly key: string;

  /** see [[ItmAreaConfig.size]]. */
  readonly size: number;

  /** see [[ItmAreaConfig.grow]]. */
  readonly grow: number;

  /** see [[ItmAreaConfig.text]]. */
  readonly text: ComponentType;

  /** see [[ItmAreaConfig.header]]. */
  readonly header: ComponentType;

  /** see [[ItmAreaConfig.label]]. */
  readonly label: ComponentType;

  /** The text observable used by default components. */
  readonly defaultText?: ItmPipe<I, string>;

  /** The header observable used by default components. */
  readonly defaultHeader?: ItmPipe<I[], string>;

  /** The label observable used by default components. */
  readonly defaultLabel?: ItmPipe<I, string>;

  /** The providers to inject into the component. */
  readonly providers: StaticProvider[] = [];

  constructor(cfg: ItmAreaConfig<I>) {
    if (cfg.key && typeof cfg.key === 'string') this.key = cfg.key;
    // tslint:disable-next-line:max-line-length
    else throw new TypeError('InvalidItmAreaConfig : Expected [key] as string for prop container config');
    this.size = (cfg.size && typeof cfg.size === 'number') ? cfg.size : 2;
    this.grow = (cfg.grow && typeof cfg.grow === 'number') ? cfg.grow : 0;
    this.text = isComponentType(cfg.text) ? cfg.text as ComponentType : null;
    if (!this.text && cfg.text !== false) (
      this.defaultText = (
        !cfg.text ? item => of(item[this.key]) :
        typeof cfg.text === 'string' ? item => of(item[cfg.text as string]) :
          deferPipe(cfg.text as ItmPipeLike<I, string>)
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
    if (Array.isArray(cfg.providers)) this.providers = [...cfg.providers];
  }
}
