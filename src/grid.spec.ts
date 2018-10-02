import Area from './area';
import Grid from './grid';
import GridArea from './grid-area';
import { List } from 'immutable';

describe('ItmGrid', () => {
  it('should create with minimal config', () => {
    expect(Grid.factory.serialize({template: 'name', areas: [{key: 'name'}]})).toBeTruthy();
  });

  it('should create with simple template', () => {
    expect(Grid.factory.serialize({template: 'id', areas: [{key: 'id'}]})).toBeTruthy();
  });

  const areas: Area.Config[] = [{key: 'id'}, {key: 'name'}, {key: 'email'}];

  it('should create a single line template', () => {
    const def = Grid.factory.serialize({template: 'id = id name', areas});
    expect(def.template.equals(List([List(['id', 'id', 'id', 'name'])]))).toBeTruthy();
  });

  it('should create a multi line template', () => {
    const areasDef = areas.map(cfg => Area.factory.serialize(cfg));
    const template = `
      id  .             name =
      id  control:email name =
    `;
    const def = Grid.factory.serialize({
      template, areas:
      {$default: areasDef, control: [areasDef[2]]}
    });
    const expectedTemplate = List([
      List(['id', null, 'name', 'name']),
      List(['id', 'control:email', 'name', 'name'])
    ]);
    expect(def.template.equals(expectedTemplate)).toBeTruthy();
    const expectedIdPos =  GridArea.factory.serialize({
      ...areasDef[0],
      selector: '$default',
      key: 'id',
      row: 1,
      col: 1,
      width: 1,
      height: 2
    });
    const gridAreas = def.gridAreas.toArray();
    expect(gridAreas[0]).toEqual(expectedIdPos);
    const expectedNamePos =  GridArea.factory.serialize({
      ...areasDef[0],
      selector: '$default',
      key: 'name',
      row: 1,
      col: 2,
      width: 2,
      height: 2
    });
    expect(gridAreas[1]).toEqual(expectedNamePos);
    const expectedEmailPos =  GridArea.factory.serialize({
      ...areasDef[0],
      selector: '$default',
      key: 'email',
      row: 2,
      col: 2,
      width: 1,
      height: 1
    });
    expect(gridAreas[2]).toEqual(expectedEmailPos);
  });

  it('should throw a type error when template is invalid', () => {
    let template = `
      name name
      name id
    `;
    expect(() => Grid.factory.serialize({template, areas})).toThrowError(/row.*start/);
    template = 'name name id name';
    expect(() => Grid.factory.serialize({template, areas})).toThrowError(/column.*end/);
    template = `
      name  name
      id    name
    `;
    expect(() => Grid.factory.serialize({template, areas})).toThrowError(/column.*start/);
    template = `
      name
      id
      name
    `;
    expect(() => Grid.factory.serialize({template, areas})).toThrowError(/row.*end/);
  });
});
