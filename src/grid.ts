import Area from './area';
import GridArea from './grid-area';
import RecordFactory from './record-factory';
import { List, Map, RecordOf, Set } from 'immutable';
import { reduce } from 'rxjs/operators';

export module ItmGrid {
  export type AreasConfig<T = {}> = (
    Area.Config<T>[] |
    { [key: string]: Area.Config<T>[] } |
    Map<string, Map<string, Area.Config<T>>>
  );

  export interface Config<T = {}> {
    areas?: AreasConfig<T>;
    template?: string | string[][] | List<List<string>>;
  }

  export interface Model<T = {}> extends Config<T> {
    areas: Map<string, Map<string, Area.Record<T>>>;
    template: List<List<string>>;
    gridAreas: Set<GridArea.Record<T>>;
  }

  export type Record<T = {}> = RecordOf<Model>;

  const serializer = (cfg: RecordOf<Config>): Model => {
    const template = parseTemplate(cfg.template);
    const areas = ItmGrid.parseAreas(cfg.areas);
    const gridAreas = template ? parseGridAreas(template, areas) : null;
    return {template, areas, gridAreas};
  };

  const selector = 'grid';

  export const factory: RecordFactory<Record, Config> = RecordFactory.build({
    selector,
    serializer,
    model: {areas: null, template: null, gridAreas : null}
  });

  export function parseAreas(cfg: AreasConfig): Map<string, Map<string, Area.Record>> {
    if (Array.isArray(cfg)) cfg = {$default: cfg};
    const selectorsCfg: Map<string, Map<string, Area.Config>> = (
      Map.isMap(cfg) ? cfg :
        Map(cfg).map(areaCfgs => areaCfgs.reduce(
          (acc, areaCfg) => acc.set(areaCfg.key, areaCfg),
          Map<string, Area.Config>()
        ))
    );
    return selectorsCfg.map(
      selectors => selectors.map(areaCfg => Area.factory.serialize(areaCfg))
    );
  }

  export function parseTemplate(cfg: string | string[][] | List<List<string>>): List<List<string>> {
    if (typeof cfg === 'string') cfg = cfg
      .split(/\s*\n+\s*/)
      .filter(rowTemplate => rowTemplate.length)
      .map((rowTemplate, i) => {
        const match = rowTemplate.match(templateRowRegExp);
        if (!match) throw new TypeError(`Expected Template row Regex: ${i}`);
        return match[1].split(/ +/);
      });
    else if (!Array.isArray(cfg)) throw new TypeError('Expected Array or string');
    // tslint:disable-next-line:max-line-length
    const colCount = (cfg as any[][]).reduce((max, row) => Math.max(max, row.length), 0);
    const rowCount = (cfg as any[]).length;
    const template: string[][] = [[]];
    for (let row = 0; row < rowCount; row++) for (let col = 0; col < colCount; col++) {
      if (row && !col) template.push([]);
      const prev = template[row][col - 1] || null;
      let fragment = cfg[row][col] || null;
      if (fragment)
        if (typeof fragment !== 'string') throw new TypeError('Expected optional string');
        else if (!fragmentRegExp.test(fragment))
          throw new TypeError('Expected Area fragment pattern');
        else if (fragment.length < 2) fragment = fragment === '=' ? prev : null;
      template[row][col] = fragment;
    }
    return List(template).map(row => List(row));
  }

  export function parseGridAreas(
    template: List<List<string>>,
    areas: Map<string, Map<string, Area.Record>>
  ): Set<GridArea.Record> {
    const map: Map<string, [[number, number], [number, number]]> =
      template
      .map((fragments, row) => fragments.map((fragment, col) => ({col, fragment, row})))
      .flatten()
      .reduce<Map<string, [[number, number], [number, number]]>>(
        (gridAreas, {col, fragment, row}, i, fragments) => {
          const prevHash = row && col ? fragments[i - 1].fragment : null;
          if (
            prevHash &&
            prevHash !== fragment &&
            gridAreas.get(prevHash)[1][1] >= col
          ) throw new TypeError(`Invalid row start: '${fragment}'`);
          if (!fragment) return gridAreas;
          if (!gridAreas.has(fragment)) return gridAreas.set(fragment, [[row, col], [row, col]]);
          const [[startRow, startCol], [endRow, endCol]] = gridAreas.get(fragment);
          if (row === startRow && col - 1 > endCol)
            throw new TypeError(`Invalid column end: '${fragment}'`);
          if (row > startRow && fragment !== prevHash && col > startCol)
            throw new TypeError(`Invalid column start: '${fragment}'`);
          if (row - 1 > endRow)
            throw new TypeError(`Invalid row end: '${fragment}'`);
          // tslint:disable-next-line:max-line-length
          return gridAreas.set(fragment, [[startRow, startCol], [Math.max(row, endRow), Math.max(col, endCol)]]);
        },
        Map()
    );
    return Set(map.keys()).map(fragment => {
      const [areaSelector, areaKey] = (
        fragment.indexOf(':') >= 0 ?
        fragment.split(':') :
        ['$default', fragment]
      );
      const area = this.areas.has(selector) ? areas.get(selector).get(areaKey) : null;
      if (!area) throw new ReferenceError('Missing area for fragment: ' + fragment);
      const [[row, col], [endRow, endCol]] = map.get(fragment);
      // tslint:disable-next-line:max-line-length
      return GridArea.factory.serialize(area, {
        selector: areaSelector,
        key: areaKey,
        row: row + 1,
        col: col + 1,
        width: endCol - col + 1,
        height: endRow - row + 1
      });
    });
  }

  export const keyPattern = '[a-z]\\w+(?:\\.[a-z]\\w+)*';
  export const keyRegExp = new RegExp(`^${keyPattern}$`);
  export const selectorCallPattern = `${RecordFactory.selectorPattern}:${keyPattern}`;
  export const fragmentPattern = `(?:(?:${keyPattern})|(?:${selectorCallPattern})|=|\\.)`;
  export const fragmentRegExp = new RegExp(`^${fragmentPattern}$`);
  export const templateRowPattern = ` *(${fragmentPattern}(?: +${fragmentPattern})*) *`;
  export const templateRowRegExp = new RegExp(`^${templateRowPattern}$`);
}

export default ItmGrid;
