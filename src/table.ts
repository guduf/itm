import { RecordOf } from 'immutable';

import Area from './area';
import Column from './column';
import Grid from './grid';

export type ItmTable<T extends Object = {}>= Grid & RecordOf<ItmTable.Model>;

export module ItmTable {
  export interface Model {
    header: Grid;
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
    return {header};
  };

  const selector = 'table';

  export const factory: Grid.Factory<ItmTable, {}> = Grid.factory.extend({
    selector,
    serializer,
    model: {header: null},
    shared: new Grid.Shared({
      defaultSelector: Column.factory.selector,
      areaFactories: [Column.factory]
    })
  });
}

export default ItmTable;
