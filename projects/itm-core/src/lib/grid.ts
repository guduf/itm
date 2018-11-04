import { RecordOf, List } from 'immutable';

import Areas from './grid_areas';
import Template from './grid_template';
import { AbstractRecord } from './utils';

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

  export const selector = 'grid';
}

export default ItmGrid;
