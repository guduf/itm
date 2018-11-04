import { Map } from 'immutable';

import Area from './area';
import AreaFactory from './area_factory';

export type ItmGridAreas<T extends Object = {}> = Map<string, Map<string, Area<T>>>;

export module ItmGridAreas {
  // tslint:disable-next-line:max-line-length
  export type Config<T = {}> = Area.Config<T>[] | { [selector: string]: Area.Config<T>[] } | Map<string, Map<string, Area.Config<T>>>;

  export function parse(
    cfg: Config,
    factories: Map<string, AreaFactory> = Map()
  ): ItmGridAreas {
    if (Array.isArray(cfg)) cfg = {[Area.selector]: cfg};
    if (!Map.isMap(cfg)) cfg = Map(cfg).map(areaCfgs => areaCfgs.reduce(
      (acc, areaCfg) => acc.set(areaCfg.key, areaCfg),
      Map<string, Area.Config>()
    ));
    return cfg.map((selectorCfgs, areaSelector) => {
      const areaFactory = factories.get(areaSelector, AreaFactory());
      return selectorCfgs.map(areaCfg => areaFactory.serialize(areaCfg));
    });
  }

  export function insert<C extends Area.Config<T> = Area.Config<T>, T extends Object = {}>(
    areas: ItmGridAreas,
    factory: AreaFactory<Area, C>,
    ...cfgs: (Partial<C> | Partial<C>[])[]
  ): ItmGridAreas<T> {
    return cfgs.reduce(
      (acc, cfg) => {
        const area = factory.serialize(...(Array.isArray(cfg) ? cfg : [cfg]));
        return acc.setIn([factory.selector, area.key], area);
      },
      areas
    );
  }
}

export default ItmGridAreas;
