import { ItmAreaDef } from './area-def';
import { ItmAreaConfig, ItmAreasConfig } from './area-config';

export type ItmSelectorsConfig = (
  Map<string, typeof ItmAreaDef> |
  { [selector: string]: typeof ItmAreaDef } |
  [string, typeof ItmAreaDef][]
);

export interface ItmGridConfig<T = {}> {
  areas?: ItmAreasConfig<ItmAreaConfig<T>>;
  template?: string | string[][];
  positions?: Map<string, [[number, number], [number, number]]>;
  selectors?: ItmSelectorsConfig;
}

export interface ItmGridPosition {
  size:
}

const AREA_KEY_PATTERN = '[a-z]\\w+(?:\\.[a-z]\\w+)*';
const AREA_KEY_REGEX = new RegExp(`^${AREA_KEY_PATTERN}$`);
const AREA_SELECTOR_PATTERN = '[a-z]\\w+';
const AREA_SELECTOR_REGEX = new RegExp(`^${AREA_SELECTOR_PATTERN}$`);
const AREA_SELECTOR_CALL_PATTERN = `(${AREA_SELECTOR_PATTERN})\\((${AREA_KEY_PATTERN})\\)`;
const AREA_SELECTOR_CALL_REGEX = new RegExp(`^${AREA_SELECTOR_CALL_PATTERN}$`);
const AREA_FRAGMENT_PATTERN = `(?:(?:${AREA_KEY_PATTERN})|(?:${AREA_SELECTOR_CALL_PATTERN})|=|\\.)`;
const TEMPLATE_ROW_PATTERN = ` *(${AREA_FRAGMENT_PATTERN}(?: +${AREA_FRAGMENT_PATTERN}))* *`;
const TEMPLATE_ROW_REGEX = new RegExp(`^${TEMPLATE_ROW_PATTERN}$`);

// tslint:disable-next-line:max-line-length
export class ItmGridDef<T = {}> {
  readonly areas: Map<string, Map<string, ItmAreaDef>>;
  readonly template: [string, string][][];
  readonly positions: Map<string, [[number, number], [number, number]]>;
  readonly selectors: Map<string, typeof ItmAreaDef>;

  constructor(cfg: ItmGridConfig<T> = {}) {
    this.selectors = this._parseSelectors(cfg.selectors);
    this.areas = this._parseAreas(cfg.areas);
    this.template = this._parseTemplate(cfg.template);
    this.positions = this._parsePositions(cfg.template);
  }

  private _parseAreas(cfg: ItmAreasConfig): Map<string, Map<string, ItmAreaDef>> {
    cfg = Array.isArray(cfg) ? cfg : cfg instanceof Map ? Array.from(cfg.values()) : null;
    if (!cfg) throw new TypeError('Expected Array or Map of ItmAreaConfig');
    return cfg
      .map(areaCfg => {
        if (!areaCfg) throw new TypeError('Expected ItmAreaConfig or string');
        if (areaCfg === 'string') return new ItmAreaDef({key: areaCfg});
        const selector = (areaCfg as ItmAreaConfig).selector;
        if (!selector) return new ItmAreaDef(areaCfg as ItmAreaConfig);
        // tslint:disable-next-line:max-line-length
        if (typeof selector !== 'string') throw new TypeError('Expected optional string as ItmAreaConfig.selector');
        const ctor = this.selectors.get(selector);
        // tslint:disable-next-line:max-line-length
        if (!ctor) throw new ReferenceError(`Missing ItmTypeDef constructor for selector: ${selector}`);
        if (areaCfg instanceof ctor) return areaCfg;
        return new ctor(areaCfg as ItmAreaConfig);
      })
      .reduce(
        (map, areaDef) => {
          if (!map.has(areaDef.selector)) map.set(areaDef.selector, new Map());
          map.get(areaDef.selector).set(areaDef.key, areaDef);
          return map;
        },
        new Map()
      );
  }

  private _parseSelectors(cfg: ItmSelectorsConfig): Map<string, typeof ItmAreaDef> {
    const selectors = ((
      // tslint:disable-next-line:max-line-length
      cfg instanceof Map ? Array.from(cfg.keys()).map(selector => ([selector, cfg.get(selector)])) :
      // tslint:disable-next-line:max-line-length
      typeof cfg === 'object' ? Object.keys(cfg).map(selector => ([selector, cfg[selector]])) :
        null
    ) as [string, typeof ItmAreaDef][]);
    if (!selectors) return null;
    return selectors.reduce(
      (map, [selector, ctor]) => {
        // tslint:disable-next-line:max-line-length
        if (!AREA_SELECTOR_REGEX.test(selector)) throw new TypeError('Expected Area selector pattern');
        let target = ctor;
        let isTypeOfAreaDef = ctor === ItmAreaDef;
        while (!isTypeOfAreaDef && target) {
          const prototype = Object.getPrototypeOf(target);
          if (prototype !== ItmAreaDef) target = prototype;
          else (isTypeOfAreaDef = true);
        }
        if (!isTypeOfAreaDef) throw new TypeError('Expected type of ItmAreaDef');
        return map.set(selector, ctor);
      },
      new Map()
    );
  }

  private _parseTemplate(cfg: string | (string | [string, string])[][]): [string, string][][] {
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
    const template: [string, string][][] = [[]];
    for (let row = 0; row < rowCount; row++) for (let col = 0; col < colCount; col++) {
      if (row && !col) template.push([]);
      const prev = template[row][col - 1] || null;
      let fragment = cfg[row][col] || null;
      if (Array.isArray(fragment) && (
        fragment.length !== 2 ||
        !AREA_SELECTOR_REGEX.test(fragment[0]) ||
        !AREA_KEY_REGEX.test(fragment[1])
      )) throw new TypeError('Expected Area fragment');
      else if (typeof fragment === 'string')
        if (fragment.length < 2) fragment = fragment === '=' ? prev : null;
        else {
          const match = fragment.match(AREA_SELECTOR_CALL_REGEX);
          fragment = match ? [match[1], match[2]] : ['area', fragment];
        }
      template[row][col] = fragment as [string, string];
    }
    return template;
  }


  private _parsePositions(): Map<string, [[number, number], [number, number]]> {
    return ([]
      .concat(...this.template.map((fragments, row) => fragments.map(
        (fragment, col) => ({col, hash: fragment ? fragment.join(';') : null, row}))
      )) as {col: number, hash: string, row: number}[])
      .reduce<Map<string, [[number, number], [number, number]]>>(
        (positions, {col, hash, row}, i, fragments) => {
          const prevHash = row && col ? fragments[i - 1].hash : null;
          if (
            prevHash &&
            prevHash !== hash &&
            positions.get(prevHash)[1][1] >= col
          ) throw new TypeError(`Invalid row start: '${hash}'`);
          if (!hash) return positions;
          if (!positions.has(hash)) {
            const [selector, key] = hash.split(';');
            if (!this.areas.has(selector) || !this.areas.get(selector).has(key))
              throw new ReferenceError('Missing ItmAreaDef');
            return positions.set(hash, [[row, col], [row, col]]);
          }
          const [[startRow, startCol], [endRow, endCol]] = positions.get(hash);
          if (row === startRow && col - 1 > endCol)
            throw new TypeError(`Invalid column end: '${hash}'`);
          if (row > startRow && hash !== prevHash && col > startCol)
            throw new TypeError(`Invalid column start: '${hash}'`);
          if (row - 1 > endRow)
            throw new TypeError(`Invalid row end: '${hash}'`);
          // tslint:disable-next-line:max-line-length
          return positions.set(hash, [[startRow, startCol], [Math.max(row, endRow), Math.max(col, endCol)]]);
        },
        new Map()
    );
  }
}
