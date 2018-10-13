
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

  readonly providers: Map<InjectionToken<any>, any>;

  constructor(cfg: ItmAreaConfig<T>) {
    if (cfg.key && typeof cfg.key === 'string') this.key = cfg.key;
    else throw new TypeError('Expected key');
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
    this.providers = (
      Map.isMap(cfg.providers) ? cfg.providers :
      !Array.isArray(cfg.providers) ? Map() :
        cfg.providers
          .map(({provide, useValue}) => {
            if (!provide || !useValue) throw new TypeError('Expected value provider');
            return [provide, useValue];
          })
          .reduce((acc, [key, val]) => acc.set(key, val), Map<InjectionToken<any>, any>())
    );
  }
}

export module ItmArea {
  export const selector = 'area';

  export type Config<T = {}> = ItmAreaConfig<T>;

  export type Model<T = {}> = ItmAreaModel<T>;

  export type Record<T = {}> = RecordOf<Model<T>>;

  export class Shared<R extends ItmArea.Record<T> = ItmArea.Record<T>, T = {}> {
    readonly defaultCell?: ComponentType;
    readonly provide?: (record: R, target: T) => Map<InjectionToken<any>, any>;

    constructor(shared: Shared<R>) { Object.assign(this, shared); }
  }

  // tslint:disable-next-line:max-line-length
  export type Factory<R extends ItmArea.Record = ItmArea.Record , C extends ItmArea.Config = ItmArea.Config> = RecordFactory<R, C, any, Shared<R>>;

  export const factory: Factory = RecordFactory.build({
    selector,
    serializer: (cfg: Config) => new ItmAreaModel(cfg),
    model: {key: null, size: null, grow: null, cell: null, text: null, providers: null},
    shared: new Shared({})
  });

  export function getFactoriesProviders(
    factories: Collection<string, Factory>,
    record: Record,
    target: Object
  ): Map<InjectionToken<any>, any> {
    return factory.getShared(factories, record)
      .flatMap(({provide}) => (provide ? provide(record, target) : Map()));
  }

  export type Configs<C extends Config = Config> = C[] | Map<string, C>;

  // tslint:disable-next-line:max-line-length
  export function serializeAreas<R extends Record<M>, C extends Config, M extends Object>(
    cfgs: Configs<C>,
    areaFactory = factory as Factory<R>
  ): Map<string, R> {
    if (Array.isArray(cfgs)) (
      cfgs = cfgs.reduce((cfgsAcc, cfg) => cfgsAcc.set(cfg.key, cfg), Map<string, C>())
    );
    return cfgs.map(cfg => areaFactory.serialize(cfg));
  }

  export const RECORD_TOKEN = new InjectionToken('ITM_AREA_RECORD');
}

export default ItmArea;
