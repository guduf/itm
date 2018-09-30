import Area from './area';
import RecordFactory from './record-factory';

export type ItmAreasConfig<T = {}> = (
  (string | Area.Config<T>)[] |
  { $default: (string | Area.Config<T>)[], [selector: string]: (string | Area.Config<T>)[] } |
  Map<string, Map<string, Area.Config<T>>>
);

export interface ItmGridConfig<T = {}> {
  areas?: ItmAreasConfig<T>;
  template?: string | string[][];
}

export class ItmGridArea {
  constructor(
    readonly area: Area.Record,
    readonly selector: string,
    readonly key: string,
    readonly row: number,
    readonly col: number,
    readonly width: number,
    readonly height: number,
  ) { }
}

// tslint:disable-next-line:max-line-length
export class ItmGrid implements ItmGridConfig {
  readonly areas: Map<string, Map<string, Area.Record>>;
  readonly template: string[][];
  readonly gridAreas: ItmGridArea[];

  static parseAreas(
    cfg: ItmAreasConfig,
    extraAreas?: { [selector: string]: (string | Area.Config)[] }
  ): Map<string, Map<string, Area.Record>> {
    const selectors: { selector: string, areas: (string | Area.Config)[] }[] = [
      ...(
        Array.isArray(cfg) ?
          [{selector: '$default', areas: cfg}] :
        cfg instanceof Map ?
          Array.from(cfg.keys()).map(selector => ({
            selector,
            areas: Array.from((cfg).get(selector).values())
          })) :
        cfg && typeof cfg === 'object' ?
          Object.keys(cfg).map(selector => ({selector, areas: cfg[selector]})) :
          []
      ),
      ...(
        extraAreas ?
          Object.keys(extraAreas).map(selector => ({selector, areas: extraAreas[selector]})) :
          []
      )
    ];
    return selectors.reduce(
      (selectorsAcc, {selector, areas}) => {
        if (selector !== '$default' && !RecordFactory.selectorRegex.test(selector))
          throw new TypeError('Expected selector pattern or $default');
        const keysMap = areas
          .map(areaCfg => {
            if (!areaCfg) throw new TypeError('Expected Area.Config or string');
            if (typeof areaCfg === 'string') areaCfg = {key: areaCfg};
            // tslint:disable-next-line:max-line-length
            else if (typeof areaCfg !== 'object') throw new TypeError('Expected Area.Config or string');
            if (!AREA_KEY_REGEX.test(areaCfg.key)) throw new TypeError('Expected string as [key]');
            return Area.factory.serialize(areaCfg);
          })
          .reduce((keysAcc, areaCfg) => keysAcc.set(areaCfg.key, areaCfg), new Map());
        selectorsAcc.set(selector, keysMap);
        return selectorsAcc;
      },
      new Map()
    );
  }

  constructor(
    cfg: ItmGridConfig = {},
    extraAreas?: { [selector: string]: (string | Area.Config)[] }
  ) {
    this.template = this._parseTemplate(cfg.template);
    this.areas = ItmGrid.parseAreas(cfg.areas, extraAreas);
    this.gridAreas = this.template ? this._parsePositions() : null;
  }

  private _parseTemplate(cfg: string | string[][]): string[][] {
    if (typeof cfg === 'string') cfg = cfg
      .split(/\s*\n+\s*/)
      .filter(rowTemplate => rowTemplate.length)
      .map((rowTemplate, i) => {
        const match = rowTemplate.match(TEMPLATE_ROW_REGEX);
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
        else if (!AREA_FRAGMENT_REGEX.test(fragment))
          throw new TypeError('Expected Area fragment pattern');
        else if (fragment.length < 2) fragment = fragment === '=' ? prev : null;
      template[row][col] = fragment;
    }
    return template;
  }


  private _parsePositions(): ItmGridArea[] {
    const map: Map<string, [[number, number], [number, number]]> = ([]
      .concat(...this.template.map((fragments, row) => fragments.map(
        (fragment, col) => ({col, fragment, row}))
      )) as {col: number, fragment: string, row: number}[])
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
        new Map()
    );
    return Array.from(map.keys()).map(fragment => {
      const [selector, key] = (
        fragment.indexOf(':') >= 0 ?
        fragment.split(':') :
        ['$default', fragment]
      );
      const area = this.areas.has(selector) ? this.areas.get(selector).get(key) : null;
      if (!area) throw new ReferenceError('Missing area for fragment: ' + fragment);
      const [[row, col], [endRow, endCol]] = map.get(fragment);
      // tslint:disable-next-line:max-line-length
      return new ItmGridArea(area, selector, key, row + 1, col + 1, endCol - col + 1, endRow - row + 1);
    });
  }
}
const AREA_KEY_PATTERN = '[a-z]\\w+(?:\\.[a-z]\\w+)*';
const AREA_KEY_REGEX = new RegExp(`^${AREA_KEY_PATTERN}$`);
const AREA_SELECTOR_CALL_PATTERN = `${RecordFactory.selectorPattern}:${AREA_KEY_PATTERN}`;
const AREA_FRAGMENT_PATTERN = `(?:(?:${AREA_KEY_PATTERN})|(?:${AREA_SELECTOR_CALL_PATTERN})|=|\\.)`;
const AREA_FRAGMENT_REGEX = new RegExp(`^${AREA_FRAGMENT_PATTERN}$`);
const TEMPLATE_ROW_PATTERN = ` *(${AREA_FRAGMENT_PATTERN}(?: +${AREA_FRAGMENT_PATTERN})*) *`;
const TEMPLATE_ROW_REGEX = new RegExp(`^${TEMPLATE_ROW_PATTERN}$`);
