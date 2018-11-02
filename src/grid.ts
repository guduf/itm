import { Map, RecordOf, List } from 'immutable';
import { Observable } from 'rxjs';

import Action from './action';
import Area from './area';
import Areas from './grid-areas';
import Template from './grid-template';
import RecordFactory from './record-factory';
import { AbstractRecord, mapOrArray } from './utils';

// tslint:disable-next-line:max-line-length
export abstract class ItmGrid<T extends Object = {}> extends AbstractRecord<ItmGrid.Model> implements RecordOf<ItmGrid.Model> {
  areas: Areas<T>;
  template: Template;
  positions: Template.Positions;
  /** The grid size of grid. The first member is for columns and the second for rows. */
  size: List<number>;
}

export module ItmGrid {
  export interface Config<T extends Object = {}> {
    areas?: Areas.Config<T>;
    template?: string | (string | Template.Fragment)[][] | Template;
  }

  export interface Model<T extends Object = {}> extends Config<T> {
    areas: Areas<T>;
    template: Template;
    positions: Template.Positions;
    size: List<number>;
  }

  interface SharedConfig {
    areaFactories?: Map<string, Area.Factory<Area, any>> | Area.Factory<Area, any>[];
    defaultSelector?: string;
    providers?: Area.Providers;
    resolversProvider?: ResolversProvider;
  }

  export interface ResolversProvider {
    deps?: any[];
    useFactory: (...args: any[]) => Observable<Action.Resolvers>;
  }

  export class Shared {
    readonly areaFactories: Map<string, Area.Factory<Area, any>>;
    readonly defaultSelector: string | null;
    readonly providers: Area.Providers;
    readonly resolversProvider?: ResolversProvider;

    constructor({areaFactories, defaultSelector, providers, resolversProvider}: SharedConfig) {
      this.areaFactories = mapOrArray(areaFactories, 'selector');
      this.defaultSelector = (
        defaultSelector && typeof defaultSelector === 'string' ? defaultSelector : null
      );
      this.providers = Map.isMap(providers) ? providers : Map();
      this.resolversProvider = resolversProvider ? resolversProvider : null;
    }
  }

  const serializer = (cfg: RecordOf<Config>, ancestor: null, shared: Shared): Model => {
    const areas = Areas.parse(cfg.areas, shared.areaFactories);
    const template = Template.parse(cfg.template);
    const positions = Template.parsePositions(template, shared.defaultSelector);
    const size = List([template.first(List()).size, template.size]);
    return {areas, template, positions, size};
  };

  const selector = 'grid';

  // tslint:disable-next-line:max-line-length
  export type Factory<R extends RecordOf<Model> = ItmGrid , C extends ItmGrid.Config = ItmGrid.Config> = RecordFactory<R, C, any, Shared>;

  export const factory: Factory = RecordFactory.build({
    selector,
    serializer,
    model: {areas: null, template: null, positions: null, size: null},
    shared: new Shared({})
  });
}

export default ItmGrid;
