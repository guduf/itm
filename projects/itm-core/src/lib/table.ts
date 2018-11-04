import { RecordOf } from 'immutable';

import Grid from './grid';
import Areas from './grid_areas';
import Template from './grid_template';
import Menu from './menu';

export type ItmTable<T extends Object = {}>= Grid & RecordOf<ItmTable.Model<T>>;

export module ItmTable {
  export interface ModelConfig<T extends Object = {}> {
    headerMenu?: Menu.Config<T[]>;
    menu?: Menu.Config<T>;
  }

  export interface Model<T extends Object = {}> extends ModelConfig {
    areas: Areas<T>;
    header: Grid<T>;
    headerMenu: Menu<T[]> | null;
    menu: Menu<T> | null;
    positions: Template.Positions;
  }

  export const selector = 'table';
}

export default ItmTable;
