import { StaticProvider } from '@angular/core';
import { Map, Record as createRecord, RecordOf, List } from 'immutable';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

import Area, { ItmAreaText } from './area';
import ItmConfig from './config';
import Areas from './grid-areas';
import Template from './grid-template';
import RecordFactory from './record-factory';
import Target from './target';
import { AbstractRecord, ComponentType } from './utils';

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

  export class Shared {
    readonly areaFactories: Map<string, Area.Factory<Area, any>>;
    readonly defaultSelector: string | null;
    readonly providers: Map<any, Area.Provider>;

    constructor(
      {areaFactories, defaultSelector, providers}: {
        areaFactories?: Map<string, Area.Factory<Area, any>> | Area.Factory<Area, any>[];
        defaultSelector?: string;
        providers?: Map<any, Area.Provider>;
      }
    ) {
      this.areaFactories = (
        Map.isMap(areaFactories) ? areaFactories :
        !Array.isArray(areaFactories) ? Map() :
          areaFactories.reduce(
            (acc, fact) => acc.set(fact.selector, fact),
            Map<string, Area.Factory>()
          )
      );
      this.defaultSelector = (
        defaultSelector && typeof defaultSelector === 'string' ? defaultSelector : null
      );
      this.providers = Map.isMap(providers) ? providers : Map();
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

  export interface AreaRef {
    area: Area;
    comp: ComponentType;
    position: Template.Position;
    providers: StaticProvider[];
  }

  export function parseAreaRefs(
    config: ItmConfig,
    grid: ItmGrid,
    target: BehaviorSubject<any>
  ): Map<Template.Fragment, AreaRef> {
    const defaultProviders = Map<any, Area.Provider>()
      .set(ItmGrid, {useValue: grid})
      .set(Target, {useValue: target});
    const gridShared = factory.getShared(config.gridFactories, grid).reduce(
      (acc, {defaultSelector, providers: gridProviders}) => ({
        defaultSelector: defaultSelector || acc.defaultSelector,
        providers: acc.providers.merge(gridProviders)
      }),
      {defaultSelector: null, providers: defaultProviders} as Partial<Shared>
    );
    return grid.positions.map(position => {
      const area: Area = grid.areas.getIn([position.selector, position.key]);
      // tslint:disable-next-line:max-line-length
      if (!Area.factory.isFactoryRecord(area)) throw new ReferenceError(`Missing area for fragment : '${position.selector}:${position.key}'`);
      const areaShared = Area.factory.getShared(config.areaFactories, area).reduce<Area.Shared>(
        (acc, {defaultComp, defaultText, providers: areaProviders}) => ({
          defaultComp: defaultComp || acc.defaultComp,
          defaultText: defaultText || acc.defaultText,
          providers: acc.providers.merge(areaProviders)
        }),
        {
          defaultComp: null,
          defaultText: null,
          providers: Map<any, Area.Provider>().set(Area, {useValue: area})
        }
      );
      const comp = (
        area.comp ||
        typeof areaShared.defaultComp === 'function' ? areaShared.defaultComp(config) :
        null
      );
      const areaText = (
        area.text ? Target.map(target, area.text) :
          target.pipe(map(value => areaShared.defaultText({area, target: value})))
      );
      const providers: StaticProvider[] = gridShared.providers
        .merge(areaShared.providers)
        .set(ItmAreaText, {useValue: areaText})
        .reduce<StaticProvider[]>(
          (acc, areaProvider, key) => ([...acc, {provide: key, ...areaProvider}]),
          []
        );
      return {area, comp, position, providers};
    });
  }
}

export default ItmGrid;
