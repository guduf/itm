import { RecordOf } from 'immutable';

import Area from './area';
import Grid from './grid';
import RecordFactory from './record-factory';
import { InjectionToken } from '@angular/core';

export module ItmGridArea {
  export interface Model {
    selector: string;
    key: string;
    row: number;
    col: number;
    width: number;
    height: number;
  }

  export type Record<T = {}> = RecordOf<Area.Model<T> & Model>;

  const serializer = (model: RecordOf<Model>): Model => {
    if (!RecordFactory.selectorRegex.test(model.selector)) throw new TypeError('Expected selector');
    if (!Grid.keyRegExp.test(model.key)) throw new TypeError('Expected key');
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
    model: {selector: null, key: null, row: null, col: null, width: null, height: null},
    ancestors: [Area.factory]
  });

  export const RECORD_TOKEN = new InjectionToken('ITM_GRID_AREA_RECORD');
}

export default ItmGridArea;
