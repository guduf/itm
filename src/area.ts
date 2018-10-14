
import { InjectionToken } from '@angular/core';
import { Map, RecordOf, Collection } from 'immutable';

import { ItmAreaConfig } from './area-config';
import { ItmPipeLike } from './item';
import RecordFactory from './record-factory';
import { ComponentType, isComponentType } from './utils';

/** The definition of a column used by ItmTableComponent */
class ItmAreaModel<T = {}> implements ItmArea.Config<T> {
  /** see [[ItmAreaConfig.key]]. */
  readonly key: string;
  /** see [[ItmAreaConfig.size]]. */
  readonly size: number;
  /** see [[ItmAreaConfig.grow]]. */
  readonly grow: number;
  /** see [[ItmAreaConfig.cell]]. */
  readonly cell?: ComponentType;

  readonly text?: ItmPipeLike<T, string>;

  constructor(cfg: ItmAreaConfig<T>) {
    if (!cfg.key || !ItmArea.keyRegExp.test(cfg.key)) throw new TypeError('Expected key');
    this.key = cfg.key;
    this.size = cfg.size && typeof cfg.size === 'number' ? cfg.size : 1;
    this.grow = cfg.grow && typeof cfg.grow === 'number' ? cfg.grow : 1;
    this.cell = cfg.cell !== false && isComponentType(cfg.cell) ? cfg.cell as ComponentType : null;
    this.text = (
      cfg.text === false ? null :
      typeof cfg.text === 'function' ? cfg.text :
      !this.cell && (typeof cfg.cell === 'string' || typeof cfg.cell === 'function') ?
        cfg.cell as ItmPipeLike<T, string> :
        this.key
    );
  }
}

export type ItmArea<T = {}> = RecordOf<ItmArea.Model<T>>;

export module ItmArea {
  export const selector = 'area';

  export type Config<T = {}> = ItmAreaConfig<T>;

  export type Model<T = {}> = ItmAreaModel<T>;


  export class Shared<R extends ItmArea<T> = ItmArea<T>, T = {}> {
    readonly defaultComp?: ComponentType;
    readonly provide?: (record: R, target: T) => Map<InjectionToken<any>, any>;

    constructor(shared: Shared<R>) { Object.assign(this, shared); }
  }

  // tslint:disable-next-line:max-line-length
  export type Factory<R extends ItmArea = ItmArea , C extends ItmArea.Config = ItmArea.Config> = RecordFactory<R, C, any, Shared<R>>;

  export const factory: Factory = RecordFactory.build({
    selector,
    serializer: (cfg: Config) => new ItmAreaModel(cfg),
    model: {key: null, size: null, grow: null, cell: null, text: null},
    shared: new Shared({})
  });

  export type Configs<C extends Config = Config> = C[] | Map<string, C>;

  // tslint:disable-next-line:max-line-length
  export function serializeAreas<R extends ItmArea<M>, C extends Config, M extends Object>(
    cfgs: Configs<C>,
    areaFactory = factory as Factory<R>
  ): Map<string, R> {
    if (!cfgs) return Map();
    if (Array.isArray(cfgs)) (
      cfgs = cfgs.reduce((cfgsAcc, cfg) => cfgsAcc.set(cfg.key, cfg), Map<string, C>())
    );
    return cfgs.map(cfg => areaFactory.serialize(cfg));
  }

  export const defaultKey = '$default';
  export const keyPattern = `\\$?${RecordFactory.selectorPattern}`;
  export const keyRegExp = new RegExp(`^${keyPattern}$`);

  export const RECORD_TOKEN = new InjectionToken<ItmArea>('ITM_AREA_RECORD');

  // tslint:disable-next-line:max-line-length
  export const FACTORY_MAP_TOKEN = new InjectionToken<Map<string, Factory>>('ITM_FACTORY_MAP_TOKEN');
}

export default ItmArea;
