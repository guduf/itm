import { Map, List } from 'immutable';

import Area from './area';
import Column from './column';
import ColumnFactory from './column_factory';
import Grid from './grid';
import GridFactory from './grid_factory';
import Areas from './grid_areas';
import Table from './table';
import Template from './grid_template';
import Menu from './menu';
import MenuFactory from './menu_factory';

export function ItmTableFactory(): GridFactory<Table>;
export function ItmTableFactory(...cfgs: Partial<Grid.Config>[]): Table;
// tslint:disable-next-line:max-line-length
export function ItmTableFactory(...cfgs: Partial<Grid.Config>[]): Table | GridFactory<Table> {
  if (!cfgs.length) return ItmTableFactory._static;
  return ItmTableFactory._static.serialize(...cfgs);
}

export module ItmTableFactory {
  export function normalize(cfg: Table.ModelConfig, grid: Grid): Table.Model {
    const headerAreas: Area[] = grid.positions.reduce(
      (acc, position) => {
        // tslint:disable-next-line:max-line-length
        if (position.selector !== Column.selector) throw new TypeError('ItmTable area must be ItmColumn');
        const column: Column = grid.areas.getIn([Column.selector, position.key]);
        if (!column) throw new ReferenceError(`Missing column with key: '${position.key}'`);
        return [...acc, column.header];
      },
      []
    );
    const headerTemplate = grid.template.map(fragments => (
      fragments.map(fragment => fragment.set(0, null))
    ));
    const header = GridFactory({template: headerTemplate, areas: headerAreas});
    let areas = Map() as Areas;
    const menu = (
      MenuFactory().isFactoryRecord(cfg.menu) ? cfg.menu as Menu :
      cfg.menu ? MenuFactory({key: '$rowMenu'}, cfg.menu) :
        null
    );
    const positions  = (
      menu ?
        Template.insertPosition(grid.positions, [Menu.selector, '$rowMenu'], 'right') :
        Map() as Template.Positions
    );
    if (menu) areas = Areas.insert(areas, MenuFactory(), menu);
    const headerMenu = (
      MenuFactory().isFactoryRecord(cfg.headerMenu) ? cfg.headerMenu as Menu :
      cfg.headerMenu ? MenuFactory({key: '$tableMenu'}, cfg.headerMenu) :
        null
    );
    if (headerMenu) areas = Areas.insert(areas, MenuFactory(), headerMenu);
    return {areas, header, headerMenu, menu, positions};
  }
  export const _static: GridFactory<Table, {}> = GridFactory().extend({
    selector: Table.selector,
    normalize,
    model: {header: null, areas: null, positions: null, headerMenu: null, menu: null},
    shared: new GridFactory.Shared({
      defaultSelector: Column.selector,
      areaFactories: [ColumnFactory()]
    })
  });
}

export default ItmTableFactory;
