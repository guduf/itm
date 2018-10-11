import { InjectionToken } from '@angular/core';
import { Map, RecordOf, Set } from 'immutable';

import Area from './area';
import Grid from './grid';
import RecordFactory from './record-factory';

export module ItmGridArea {
  export interface Model<T extends Object = {}> {
    area: Area.Record<T>;
    selector: string;
    key: string;
    row: number;
    col: number;
    width: number;
    height: number;
  }

  export type Record = RecordOf<Model>;

  const serializer = (model: RecordOf<Model>): Model => {
    if (!ItmGridArea.selectorRegExp.test(model.selector)) throw new TypeError('Expected selector');
    if (!keyRegExp.test(model.key)) throw new TypeError('Expected key');
    if (!Area.factory.isFactoryRecord(model.area)) throw new TypeError('Expected Area record');
    if (!(model.row > 0)) throw new TypeError('Expected positive number');
    if (!(model.col > 0)) throw new TypeError('Expected positive number');
    if (!(model.width > 0)) throw new TypeError('Expected positive number');
    if (!(model.height > 0)) throw new TypeError('Expected positive number');
    return model;
  };

  const selector = 'gridArea';

  export const factory: RecordFactory<Record> = RecordFactory.build({
    selector,
    serializer,
    model: {selector: null, key: null, area: null, row: null, col: null, width: null, height: null}
  });

  export function parseGridAreas<T extends Object>(grid: Grid.Record<T>): Set<Record> {
    const map: Map<string, [[number, number], [number, number]]> = grid.template
      .toList()
      .map((fragments, row) => fragments.toList().map((fragment, col) => ({col, fragment, row})))
      .flatten()
      .reduce<Map<string, [[number, number], [number, number]]>>(
        (gridAreas, {col, fragment, row}, i, fragments) => {
          const prev = row && col ? fragments.get(i - 1).fragment : null;
          if (
            prev &&
            prev !== fragment &&
            gridAreas.get(prev)[1][1] >= col
          ) throw new TypeError(`Invalid row start: '${fragment}'`);
          if (!fragment) return gridAreas;
          if (!gridAreas.has(fragment)) return gridAreas.set(fragment, [[row, col], [row, col]]);
          const [[startRow, startCol], [endRow, endCol]] = gridAreas.get(fragment);
          // tslint:disable-next-line:max-line-length
          if (row === startRow && col - 1 > endCol) throw new TypeError(`Invalid column end: '${fragment}'`);
          // tslint:disable-next-line:max-line-length
          if (row > startRow && fragment !== prev && col > startCol) throw new TypeError(`Invalid column start: '${fragment}'`);
          if (row - 1 > endRow) throw new TypeError(`Invalid row end: '${fragment}'`);
          return gridAreas.set(
            fragment,
            [[startRow, startCol], [Math.max(row, endRow), Math.max(col, endCol)]]
          );
        },
        Map()
    );
    return Set(map.keys()).map(fragment => {
      const areaPath = (
        !fragment.indexOf(':') ? [Area.selector, fragment.slice(1)] :
        fragment.indexOf(':') > 0 ? fragment.split(':') :
          [grid.defaultSelector || Area.selector, fragment]
      );
      const area = grid.areas.getIn(areaPath);
      if (!area) throw new ReferenceError('Missing area for fragment: ' + fragment);
      const [[row, col], [endRow, endCol]] = map.get(fragment);
      return factory.serialize({
        area,
        selector: areaPath[0],
        key: areaPath[1],
        row: row + 1,
        col: col + 1,
        width: endCol - col + 1,
        height: endRow - row + 1
      });
    });
  }

  export const RECORD_TOKEN = new InjectionToken('ITM_GRID_AREA_RECORD');

  export const keyPattern = '[a-z]\\w+(?:\\.[a-z]\\w+)*';
  export const keyRegExp = new RegExp(`^${keyPattern}$`);
  export const selectorPattern = `${RecordFactory.selectorPattern}`;
  export const selectorRegExp = new RegExp(`^${selectorPattern}$`);
}

export default ItmGridArea;
