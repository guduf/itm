import Column from './column';
import Grid from './grid';
import Table from './table';

describe('ItmTable', () => {
  const column = Column.factory.serialize({key: 'name'});
  const grid = Grid.factory.serialize({
    template: 'column:name',
    areas: {column: [column]}
  });

  it('should create with minimal arguments', () => {
    expect(Table.serialize({} as any, grid));
  });
});
