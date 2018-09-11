import { StaticProvider, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Itm, ItmPipe, ItmPipeLike, deferPipe, ItmsChanges } from './item';
import { ComponentType, isComponentType } from './utils';
import { ItmAreaConfig } from './area-config';

/** The definition of a column used by ItmTableComponent */
export class ItmAreaDef<I extends Itm = Itm> implements ItmAreaConfig {
  readonly key: string;
  readonly size: number;
  readonly grow: number;
  readonly text: ComponentType;
  readonly header: ComponentType;
  readonly label: ComponentType;

  readonly defaultText?: ItmPipe<I, string>;
  readonly defaultHeader?: ItmPipe<I[], string>;
  readonly defaultLabel?: ItmPipe<I, string>;
  readonly providers: StaticProvider[] = [];

  constructor(cfg: ItmAreaConfig<I>) {
    if (cfg.key && typeof cfg.key === 'string') this.key = cfg.key;
    // tslint:disable-next-line:max-line-length
    else throw new TypeError('InvalidItmAreaConfig : Expected [key] as string for prop container config');
    this.size = (cfg.size && typeof cfg.size === 'number') ? cfg.size : 2;
    this.grow = (cfg.grow && typeof cfg.grow === 'number') ? cfg.grow : 0;
    this.text = isComponentType(cfg.text) ? cfg.text as ComponentType : null;
    if (!this.text && cfg.text === false) this.text = null;
    else if (!this.text) (
      this.defaultText = (
        !cfg.text ? item => of(item[this.key]) :
        typeof cfg.text === 'string' ? item => of(item[cfg.text as string]) :
          deferPipe(cfg.text as ItmPipeLike<I, string>)
      )
    );
    this.label = isComponentType(cfg.label) ? cfg.label as ComponentType : null;
    if (!this.label && cfg.label === false) this.label = null;
    else if (!this.label) (
      this.defaultLabel = (
        !cfg.label ? () => of(this.key) :
        typeof cfg.label === 'string' ? item => of(item[cfg.label as string]) :
          deferPipe(cfg.label as ItmPipeLike<I, string>)
      )
    );
    this.header = isComponentType(cfg.header) ? cfg.header as ComponentType : null;
    if (!this.header && cfg.header === false) (this.header = null);
    else if (!this.header) (
      this.defaultHeader = (
        !cfg.header ? () => of(this.key) :
        typeof cfg.header === 'string' ? () => of(cfg.header as string) :
          deferPipe(cfg.header as ItmPipeLike<I[], string>)
      )
    );
  }
}
