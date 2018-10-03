// tslint:disable:max-line-length
import Area from './area';
import Grid from './grid';
import GridArea from './grid-area';
import { List, Record } from 'immutable';

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
    expect(def.template.equals(expectedTemplate)).toBeTruthy('Expected same template');
    const expectedIdPos = GridArea.factory.serialize({
      ...areasDef[0],
      selector: '$default',
      key: 'id',
      row: 1,
      col: 1,
      width: 1,
      height: 2,
      grow: 1,
      providers: {},
      size: 1,
      text: 'id'
    });
    const gridAreas = def.gridAreas.toArray();
    expect(gridAreas[0].toJS()).toEqual(expectedIdPos.toJS(), 'Expected same grid area with key id');
    const expectedNamePos = GridArea.factory.serialize({
      ...areasDef[0],
      selector: '$default',
      key: 'name',
      row: 1,
      col: 3,
      width: 2,
      height: 2,
      text: 'name',
      grow: 1,
      providers: {},
      size: 1
    });
    expect(gridAreas[1].toJS()).toEqual(expectedNamePos.toJS(), 'Expected same grid area with key name');
    const expectedEmailPos = GridArea.factory.serialize({
      ...areasDef[0],
      selector: 'control',
      key: 'email',
      row: 2,
      col: 2,
      width: 1,
      height: 1,
      text: 'email',
      grow: 1,
      providers: {},
      size: 1
    });
    expect(gridAreas[2].toJS()).toEqual(expectedEmailPos.toJS(), 'Expected same grid area with key email');
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
