import { Map, RecordOf } from 'immutable';

import Area from './area';
import Column from './column';
import Grid from './grid';
import Areas from './grid-areas';
import Template from './grid-template';
import Menu from './menu';

export type ItmTable<T extends Object = {}>= Grid & RecordOf<ItmTable.Model<T>>;

export module ItmTable {
  export interface Model<T extends Object = {}> {
    header: Grid<T>;
    areas: Areas<T>;
    positions: Template.Positions;
  }

  const serializer = (cfg: {}, grid: Grid): Model => {
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
    const areas = Areas.insert(Map(), Menu.factory, {
      key: '$tableMenu',
      size: [[2, 1], 1],
      buttons: [{key: '$tableDelete', icon: 'delete', text: 'delete'}]
    });
    return {header, areas, positions};
  };

  const selector = 'table';

  export const factory: Grid.Factory<ItmTable, {}> = Grid.factory.extend({
    selector,
    serializer,
    model: {header: null, areas: null, positions: null},
    shared: new Grid.Shared({
      defaultSelector: Column.factory.selector,
      areaFactories: [Column.factory]
    })
  });
}

export default ItmTable;
