/**
 * Invalid row start:
 *   name =  | name =
 *   name id | name .
 */

// tslint:disable:max-line-length
import { ItmGrid, ItmGridArea } from './grid';
import { ItmAreaConfig } from './area-config';
import { ItmArea } from './area';
describe('ItmGrid', () => {
  it('should create with minimal config', () => {
    expect(new ItmGrid({template: 'name', areas: ['name']})).toBeTruthy();
  });

  it('should create with simple template', () => {
    expect(new ItmGrid({template: 'id', areas: [{key: 'id'}]})).toBeTruthy();
  });

  const areas: ItmAreaConfig[] = [{key: 'id'}, {key: 'name'}, {key: 'email'}];

  it('should create a single line template', () => {
    const def = new ItmGrid({template: 'id = id name', areas});
    expect(def.template).toEqual([['id', 'id', 'id', 'name']]);
    // const expectedPositions = new Map<string, [[number, number], [number, number]]>();
    // expectedPositions.set('id', [[0, 0], [0, 2]]);
    // expectedPositions.set('name', [[0, 3], [0, 3]]);
    // expect (def.gridAreas).toEqual(expectedPositions);
  });

  it('should create a multi line template', () => {
    const areasDef = areas.map(cfg => new ItmArea(cfg));
    const template = `
      id  .             name =
      id  control:email name =
    `;
    const def = new ItmGrid({template, areas: areasDef}, {control: [areasDef[2]]});
    expect(def.template).toEqual([
      ['id', null, 'name', 'name'],
      ['id', 'control:email', 'name', 'name']
    ]);
    const expectedIdPos =  new ItmGridArea(areasDef[0], '$default', 'id', 1, 1, 1, 2);
    expect(def.gridAreas[0]).toEqual(expectedIdPos);
    const expectedNamePos =  new ItmGridArea(areasDef[1], '$default', 'name', 1, 3, 2, 2);
    expect(def.gridAreas[1]).toEqual(expectedNamePos);
    const expectedEmailPos =  new ItmGridArea(areasDef[2], 'control', 'email', 2, 2, 1, 1);
    expect(def.gridAreas[2]).toEqual(expectedEmailPos);
  });

  it('should throw a type error when template is invalid', () => {
    let template = `
      name name
      name id
    `;
    expect(() => new ItmGrid({template, areas})).toThrowError(/row.*start/);
    template = 'name name id name';
    expect(() => new ItmGrid({template, areas})).toThrowError(/column.*end/);
    template = `
      name  name
      id    name
    `;
    expect(() => new ItmGrid({template, areas})).toThrowError(/column.*start/);
    template = `
      name
      id
      name
    `;
    expect(() => new ItmGrid({template, areas})).toThrowError(/row.*end/);
  });
});
