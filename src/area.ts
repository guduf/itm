
import { InjectionToken } from '@angular/core';
import { Map, RecordOf } from 'immutable';
import { Observable, of, empty } from 'rxjs';

import { ItmAreaConfig } from './area-config';
import ItmConfig from './config';
import RecordFactory from './record-factory';
import Target from './target';
import { ComponentType, isComponentType, AbstractRecord } from './utils';

export abstract class ItmAreaText extends Observable<string> { }

// tslint:disable-next-line:max-line-length
export abstract class ItmArea<T extends Object = {}> extends AbstractRecord<ItmArea.Model> implements RecordOf<ItmArea.Model> {
  readonly key: string;
  readonly size: number;
  readonly grow: number;
  readonly cell: ComponentType | null;
  readonly text: Target.Pipe<T, string> | null;
}

export module ItmArea {
  export const selector = 'area';

  export type Config<T = {}> = ItmAreaConfig<T>;

  export interface Model<T = {}> extends  Config<T> {
    key: string;
    size: number;
    grow: number;
    cell: ComponentType | null;
    text: Target.Pipe<T, string> | null;
  }

  export type Provider = (
    { useValue: any } |
    { useFactory: Function, deps: any[] } |
    { useClass: any }
  );

  // tslint:disable-next-line:max-line-length
  export class Shared {
    readonly defaultComp?: (cfg: ItmConfig) => ComponentType;
    readonly providers?: Map<any, Provider>;

    constructor(shared: Shared) { Object.assign(this, shared); }
  }

  const serializer = (cfg: RecordOf<Config>): Model => {
    if (!cfg.key || !keyRegExp.test(cfg.key)) throw new TypeError('Expected key');
    const key = cfg.key;
    const size = cfg.size && typeof cfg.size === 'number' ? cfg.size : 1;
    const grow = cfg.grow && typeof cfg.grow === 'number' ? cfg.grow : 1;
    const cell = cfg.cell !== false && isComponentType(cfg.cell) ? cfg.cell as ComponentType : null;
    const text: Target.Pipe<{}, string> = (
      cfg.text === false ? () => empty() : Target.defer('string', cfg.text)
    );
    return {key, size, grow, cell, text};
  };

  const areaTextProvider: Provider = {
    deps: [ItmArea, Target],
    useFactory: (area: ItmArea, target: Target): ItmAreaText => (
      Target.map(target, area.text || (() => of(area.key)))
    )
  };

  // tslint:disable-next-line:max-line-length
  export type Factory<R extends RecordOf<Model> = ItmArea , C extends ItmArea.Config = ItmArea.Config> = RecordFactory<R, C, any, Shared>;

  export const factory: Factory = RecordFactory.build({
    selector,
    serializer,
    model: {key: null, size: null, grow: null, cell: null, text: null},
    shared: new Shared({
      providers: Map<any, Provider>().set(ItmAreaText, areaTextProvider)
    })
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


  // tslint:disable-next-line:max-line-length
  export const FACTORY_MAP_TOKEN = new InjectionToken<Map<string, Factory>>('ITM_FACTORY_MAP_TOKEN');
}

export default ItmArea;
