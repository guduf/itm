import { Map, RecordOf } from 'immutable';

import Area from './area';
import Column from './column';
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

  const serializer = (cfg: RecordOf<ModelConfig>, grid: Grid): Model => {
    const headerAreas: Area[] = grid.positions.reduce(
      (acc, position) => {
        // tslint:disable-next-line:max-line-length
        if (position.selector !== Column.factory.selector) throw new TypeError('ItmTable area must be ItmColumn');
        const column: Column = grid.areas.getIn([Column.factory.selector, position.key]);
        if (!column) throw new ReferenceError(`Missing column with key: '${position.key}'`);
        return [...acc, column.header];
      },
      []
    );
    const headerTemplate = grid.template.map(fragments => (
      fragments.map(fragment => fragment.set(0, null))
    ));
    const header = Grid.factory.serialize({template: headerTemplate, areas: headerAreas});
    const positions = Template.insertPosition(
      grid.positions,
      [Menu.factory.selector, '$tableMenu'],
      'right'
    );
    const menu = (
      Menu.factory.isFactoryRecord(cfg.menu) ? cfg.menu as Menu :
      cfg.menu ? Menu.factory.serialize({key: '$rowMenu'}, cfg.menu) :
        null
    );
    const areas = Areas.insert(Map(), Menu.factory, menu);
    const headerMenu = (
      Menu.factory.isFactoryRecord(cfg.headerMenu) ? cfg.headerMenu as Menu :
      cfg.headerMenu ? Menu.factory.serialize({key: '$tableMenu'}, cfg.headerMenu) :
        null
    );
    return {areas, header, headerMenu, menu, positions};
  };

  const selector = 'table';

  export const factory: Grid.Factory<ItmTable, {}> = Grid.factory.extend({
    selector,
    serializer,
    model: {header: null, areas: null, positions: null, headerMenu: null, menu: null},
    shared: new Grid.Shared({
      defaultSelector: Column.factory.selector,
      areaFactories: [Column.factory]
    })
  });
}

export default ItmTable;
