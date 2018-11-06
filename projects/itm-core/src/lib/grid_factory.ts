import { Map, RecordOf, List } from 'immutable';
import { Observable } from 'rxjs';

import Action from './action';
import Area from './area';
import AreaFactory from './area_factory';
import Grid from './grid';
import Areas from './grid_areas';
import Template from './grid_template';
import RecordFactory from './record_factory';
import { parseIter } from './utils';

// tslint:disable-next-line:max-line-length
export type ItmGridFactory<R extends RecordOf<Grid.Model> = Grid , C extends Grid.Config = Grid.Config> = RecordFactory<R, C, any, ItmGridFactory.Shared>;

export function ItmGridFactory(): ItmGridFactory;
export function ItmGridFactory(...cfgs: Partial<Grid.Config>[]): Grid;
// tslint:disable-next-line:max-line-length
export function ItmGridFactory(...cfgs: Partial<Grid.Config>[]): Grid | ItmGridFactory {
  if (!cfgs.length) return ItmGridFactory._static;
  return ItmGridFactory._static.serialize(...cfgs);
}
export module ItmGridFactory {
  export interface SharedConfig {
    areaFactories?: Map<string, AreaFactory<Area, any>> | AreaFactory<Area, any>[];
    defaultSelector?: string;
    providers?: Area.Providers;
    resolversProvider?: ResolversProvider;
  }

  export interface ResolversProvider {
    deps?: any[];
    useFactory: (...args: any[]) => Observable<Action.Resolvers>;
  }

  export class Shared {
    readonly areaFactories: Map<string, AreaFactory<Area, any>>;
    readonly defaultSelector: string | null;
    readonly providers: Area.Providers;
    readonly resolversProvider?: ResolversProvider;

    constructor({areaFactories, defaultSelector, providers, resolversProvider}: SharedConfig) {
      this.areaFactories = parseIter(areaFactories, 'selector');
      this.defaultSelector = (
        defaultSelector && typeof defaultSelector === 'string' ? defaultSelector : null
      );
      this.providers = Map.isMap(providers) ? providers : Map();
      this.resolversProvider = resolversProvider ? resolversProvider : null;
    }
  }

  export function normalize(cfg: Grid.Config, ancestor: null, shared: Shared): Grid.Model {
    const areas = Areas.parse(cfg.areas, shared.areaFactories);
    const template = Template.parse(cfg.template);
    const positions = Template.parsePositions(template, shared.defaultSelector);
    const size = List([template.first(List()).size, template.size]);
    return {areas, template, positions, size};
  }

  export const _static: ItmGridFactory = RecordFactory.build({
    selector: Grid.selector,
    normalize,
    model: {areas: null, template: null, positions: null, size: null},
    shared: new Shared({})
  });
}

export default ItmGridFactory;
