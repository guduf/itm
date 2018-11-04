import { List, Map, Record, RecordOf, Range } from 'immutable';

import Area from './area';
import RecordFactory from './record_factory';

export type ItmGridTemplate = Map<number, Map<number, ItmGridTemplate.Fragment>>;

export module ItmGridTemplate {
  export type Fragment = List<string>;

  export interface Position {
    selector: string;
    key: string;
    row: number;
    col: number;
    width: number;
    height: number;
  }

  export type Positions = Map<Fragment, RecordOf<Position>>;

  const positionFactory: (pos: Position) => RecordOf<Position> = (
    Record<Position>({selector: null, key: null, row: null, col: null, width: null, height: null})
  );

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
        !fragment.indexOf(':') ? [Area.selector, fragment.slice(1)] :
        fragment.indexOf(':') > 0 ? fragment.split(':') :
          [null, fragment]
      );
    else if (List.isList(fragment))
      if (!isAreaFragment(fragment)) throw new TypeError('Expected Fragment list');
      else return fragment;
    else throw new TypeError('Expected optional Area fragment pattern or Area fragment list');
  }

  // tslint:disable-next-line:max-line-length
  export function parse(cfg: string | (string | Fragment )[][] | ItmGridTemplate): ItmGridTemplate {
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
      .reduce<ItmGridTemplate>(
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

  export function getRange(positions: Positions): {rows: number, cols: number} {
    return positions.reduce(
      (acc, pos) => ({
        rows: Math.max(pos.row + pos.height - 1, acc.rows),
        cols: Math.max(pos.col + pos.width - 1, acc.cols)
      }),
      {rows: 0, cols: 0}
    );
  }

  export function insertPosition(
    positions: Positions,
    path: string | [string, string],
    direction?: 'top' | 'right'  | 'left' | 'bottom',
    dimensions?: number | [number, number]
  ): Positions {
    const [selector, key] = typeof path === 'string' ? [Area.selector, path] : path;
    const fragment = List([selector, key]);
    if (positions.has(fragment)) throw new ReferenceError('Positions has fragment');
    const {rows, cols} = getRange(positions);
    let row: number;
    let col: number;
    let width: number;
    let height: number;
    const primary = Array.isArray(dimensions) ? dimensions[0] : dimensions > 1 ? dimensions : 1;
    const secondary = Array.isArray(dimensions) ? dimensions[1] : 0;
    switch (direction) {
      case 'top': {
        row = 1;
        col = 1;
        width = secondary || cols;
        height = primary;
        positions = positions.map(pos => pos.set('row', pos.row + 1));
        break;
      }
      case 'right': {
        row = 1;
        col = cols + 1;
        width = primary;
        height = secondary || rows;
        break;
      }
      case 'left': {
        row = 1;
        col = 1;
        width = primary;
        height = secondary || rows;
        positions = positions.map(pos => pos.set('col', pos.col + 1));
        break;
      }
      default: {
        row = rows + 1;
        col = 1;
        width = secondary || cols;
        height = primary;
        break;
      }
    }
    const position = positionFactory({selector, key, row, col, width, height});
    return positions.set(fragment, position);
  }

  export function parsePositions(template: ItmGridTemplate, defaultSelector?: string): Positions {
    return template
      .toList()
      .map((fragments, row) => fragments.toList().map((fragment, col) => ({col, fragment, row})))
      .flatten()
      .reduce<Map<ItmGridTemplate.Fragment, [[number, number], [number, number]]>>(
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
          selector: fragment.first() || defaultSelector || Area.selector,
          key: fragment.last(),
          row: row + 1,
          col: col + 1,
          width: endCol - col + 1,
          height: endRow - row + 1
        });
        return gridAreas.set(fragment, position);
      },
      Map<ItmGridTemplate.Fragment, RecordOf<Position>>()
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

export default ItmGridTemplate;
