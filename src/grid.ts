import { StaticProvider } from '@angular/core';
import { Map, RecordOf, Range, Record as createRecord, List } from 'immutable';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

import Area, { ItmAreaText } from './area';
import ItmConfig from './config';
import RecordFactory from './record-factory';
import Target from './target';
import { AbstractRecord, ComponentType } from './utils';

// tslint:disable-next-line:max-line-length
export abstract class ItmGrid<T extends Object = {}> extends AbstractRecord<ItmGrid.Model> implements RecordOf<ItmGrid.Model> {
  areas: Map<string, Map<string, Area<T>>>;
  template: ItmGrid.Template;
  positions: Map<ItmGrid.Fragment, RecordOf<ItmGrid.Position>>;
}

export module ItmGrid {
  export type Fragment = List<string> | null;
  export type Template = Map<number, Map<number, Fragment>>;

  // tslint:disable-next-line:max-line-length
  export type AreasConfig<T = {}> = Area.Config<T>[] | { [selector: string]: Area.Config<T>[] } | Map<string, Map<string, Area.Config<T>>>;

  export interface Position {
    selector: string;
    key: string;
    row: number;
    col: number;
    width: number;
    height: number;
  }

  // tslint:disable-next-line:max-line-length
  const positionFactory = createRecord<Position>({selector: null, key: null, row: null, col: null, width: null, height: null});

  export interface Config<T extends Object = {}> {
    areas?: AreasConfig<T>;
    template?: string | (string | Fragment)[][] | Template;
  }

  export interface Model<T extends Object = {}> extends Config<T> {
    areas: Map<string, Map<string, Area<T>>>;
    template: Template;
    positions: Map<Fragment, RecordOf<Position>>;
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
    const areas = parseAreas(cfg.areas, shared.areaFactories);
    const template = parseTemplate(cfg.template);
    const positions = ItmGrid.parsePositions(template, shared.defaultSelector);
    return {areas, template, positions};
  };

  const selector = 'grid';

  // tslint:disable-next-line:max-line-length
  export type Factory<R extends RecordOf<Model> = ItmGrid , C extends ItmGrid.Config = ItmGrid.Config> = RecordFactory<R, C, any, Shared>;

  export const factory: Factory = RecordFactory.build({
    selector,
    serializer,
    model: {areas: null, template: null, positions: null},
    shared: new Shared({})
  });

  export function parseAreas(
    cfg: AreasConfig,
    factories: Map<string, Area.Factory> = Map()
  ): Map<string, Map<string, Area>> {
    if (Array.isArray(cfg)) cfg = {[Area.factory.selector]: cfg};
    if (!Map.isMap(cfg)) cfg = Map(cfg).map(areaCfgs => areaCfgs.reduce(
      (acc, areaCfg) => acc.set(areaCfg.key, areaCfg),
      Map<string, Area.Config>()
    ));
    return cfg.map((selectorCfgs, areaSelector) => {
      const areaFactory = factories.get(areaSelector, Area.factory);
      return selectorCfgs.map(areaCfg => areaFactory.serialize(areaCfg));
    });
  }

  export interface AreaRef {
    comp: ComponentType;
    position: Position;
    providers: StaticProvider[];
  }

  export function parseAreaRefs(
    config: ItmConfig,
    grid: ItmGrid,
    target: BehaviorSubject<any>
  ): Map<Fragment, AreaRef> {
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
          defaultComp: () => config.defaultTextComp,
          defaultText: () => of('banane'),
          providers: Map<any, Area.Provider>().set(Area, {useValue: area})
        }
      );
      const comp = area.comp || areaShared.defaultComp(config);
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
      return {comp, position, providers};
    });
  }

  export function isAreaFragment(fragment: List<string>): boolean {
    return (
      List.isList(fragment) &&
      fragment.size === 2 &&
      (fragment.first() === null || selectorRegExp.test(fragment.first())) &&
      keyRegExp.test(fragment.last())
    );
  }

  export function parseFragment(fragment: string | Fragment | null): Fragment {
    if (fragment === null) return null;
    if (typeof fragment === 'string')
      // tslint:disable-next-line:max-line-length
      if (!fragmentRegExp.test(fragment)) throw new TypeError(`Expected Area fragment pattern. Got '${fragment}'`);
      else return List(
        !fragment.indexOf(':') ? [Area.factory.selector, fragment.slice(1)] :
        fragment.indexOf(':') > 0 ? fragment.split(':') :
          [null, fragment]
      );
    else if (List.isList(fragment))
      if (!isAreaFragment(fragment)) throw new TypeError('Expected Fragment list');
      else return fragment;
    else throw new TypeError('Expected optional Area fragment pattern or Area fragment list');
  }

  // tslint:disable-next-line:max-line-length
  export function parseTemplate(cfg: string | (string | Fragment )[][] | Template): Template {
    if (typeof cfg === 'string') cfg = cfg
      .split(/\s*\n+\s*/)
      .filter(rowTemplate => rowTemplate.length)
      .map((rowTemplate, i) => {
        const match = rowTemplate.match(templateRowRegExp);
        if (!match) throw new TypeError(`Expected Template row Regex: ${i}`);
        return match[1].split(/ +/);
      });
    if (Map.isMap(cfg)) cfg = cfg.reduce<Fragment[][]>(
      (rows, row) => [...rows, row.reduce((cols, col) => [...cols, col], [])],
      []
    );
    if (!Array.isArray(cfg)) throw new TypeError('Expected Template, Array or string');
    const rawTemplate = cfg.reduce<Map<number, Map<number, string>>>(
      (cfgAcc, fragments, row) => cfgAcc.set(row, fragments.reduce<Map<number, string>>(
        (rowAcc, fragment, col) => {
          if (fragment === null) return rowAcc.set(col, '.');
          if (typeof fragment === 'string')
            if (fragmentRegExp.test(fragment)) return rowAcc.set(col, fragment);
            else throw new TypeError('Expected Area fragment pattern');
          // tslint:disable-next-line:max-line-length
          else if (!isAreaFragment(fragment)) throw new TypeError('Expected Area fragment pattern or area list');
          return rowAcc.set(
            col,
            (fragment.first() ? `${fragment.first()}:` : '') + fragment.last()
          );
        },
        Map()
      )),
      Map()
    );
    const colCount = rawTemplate.reduce((max, row) => Math.max(max, row.size), 0);
    return Range(0, rawTemplate.size)
      .flatMap(row => Range(0, colCount).map(col => ({row, col})))
      .reduce<Template>(
        (templateAcc, {row, col}) => {
          const prev = templateAcc.getIn([row, col - 1]) || null;
          let fragment = rawTemplate.getIn([row, col]) || null;
          if (fragment)
            // tslint:disable-next-line:max-line-length
            if (!fragmentRegExp.test(fragment)) throw new TypeError('Expected Area fragment pattern');
            else if (fragment.length < 2) fragment = fragment === '=' ? prev : null;
          return templateAcc.setIn([row, col], parseFragment(fragment));
        },
        Map()
      );
  }

  export function parsePositions(
    template: Template,
    defaultSelector?: string
  ): Map<Fragment, RecordOf<Position>> {
    return template
      .toList()
      .map((fragments, row) => fragments.toList().map((fragment, col) => ({col, fragment, row})))
      .flatten()
      .reduce<Map<Fragment, [[number, number], [number, number]]>>(
        (positions, {col, fragment, row}, i, fragments) => {
          const prev = row && col ? fragments.get(i - 1).fragment : null;
          if (
            prev &&
            prev !== fragment &&
            positions.get(prev)[1][1] >= col
          ) throw new TypeError(`Invalid row start: '${fragment}'`);
          if (!fragment) return positions;
          if (!positions.has(fragment)) return positions.set(fragment, [[row, col], [row, col]]);
          const [[startRow, startCol], [endRow, endCol]] = positions.get(fragment);
          // tslint:disable-next-line:max-line-length
          if (row === startRow && col - 1 > endCol) throw new TypeError(`Invalid column end: '${fragment}'`);
          // tslint:disable-next-line:max-line-length
          if (row > startRow && fragment !== prev && col > startCol) throw new TypeError(`Invalid column start: '${fragment}'`);
          if (row - 1 > endRow) throw new TypeError(`Invalid row end: '${fragment}'`);
          return positions.set(
            fragment,
            [[startRow, startCol], [Math.max(row, endRow), Math.max(col, endCol)]]
          );
        },
        Map()
    )
    .reduce(
      (gridAreas, [[row, col], [endRow, endCol]], fragment) => {
        const position = positionFactory({
          selector: fragment.first() || defaultSelector || Area.factory.selector,
          key: fragment.last(),
          row: row + 1,
          col: col + 1,
          width: endCol - col + 1,
          height: endRow - row + 1
        });
        return gridAreas.set(fragment, position);
      },
      Map<Fragment, RecordOf<Position>>()
    );
  }

  export const keyPattern = '[a-z]\\w+(?:\\.[a-z]\\w+)*';
  export const keyRegExp = new RegExp(`^${keyPattern}$`);
  export const selectorPattern = `${RecordFactory.selectorPattern}`;
  export const selectorRegExp = new RegExp(`^${selectorPattern}$`);
  export const selectorCallPattern = `(?:${selectorPattern})?:${keyPattern}`;
  export const fragmentPattern = `(?:(?:${keyPattern})|(?:${selectorCallPattern})|=|\\.)`;
  export const fragmentRegExp = new RegExp(`^${fragmentPattern}$`);
  export const templateRowPattern = ` *(${fragmentPattern}(?: +${fragmentPattern})*) *`;
  export const templateRowRegExp = new RegExp(`^${templateRowPattern}$`);
}

export default ItmGrid;
