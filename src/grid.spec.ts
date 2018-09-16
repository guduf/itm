// tslint:disable:max-line-length
import { ItmGridDef } from './grid';
import { ItmAreaConfig } from './area-config';
describe('ItmGridDef', () => {
  it('should create with minimal config', () => {
    expect(new ItmGridDef({})).toBeTruthy();
  });

  it('should create with simple template', () => {
    expect(new ItmGridDef({template: 'id', areas: [{key: 'id'}]})).toBeTruthy();
  });

  const areas: ItmAreaConfig[] = [{key: 'id'}, {key: 'name'}, {key: 'email'}];

  it('should create a single line template', () => {
    const def = new ItmGridDef({template: 'id = id name', areas});
    expect(def.template).toEqual([['id', 'id', 'id', 'name']]);
    const expectedPositions = new Map<string, [[number, number], [number, number]]>();
    expectedPositions.set('id', [[0, 0], [0, 2]]);
    expectedPositions.set('name', [[0, 3], [0, 3]]);
    expect (def.positions).toEqual(expectedPositions);
  });

  it('should create a multi line template', () => {
    const template = `
      id  .     name =
      id  email name =
    `;
    const def = new ItmGridDef({template, areas});
    expect(def.template).toEqual([
      ['id', '.', 'name', 'name'],
      ['id', 'email', 'name', 'name']
    ]);
    const expectedPositions = new Map<string, [[number, number], [number, number]]>();
    expectedPositions.set('id', [[0, 0], [1, 0]]);
    expectedPositions.set('name', [[0, 2], [1, 3]]);
    expectedPositions.set('email', [[1, 1], [1, 1]]);
    expect (def.positions).toEqual(expectedPositions);
  });

  it('should throw a type error when template is invalid', () => {
    let template = `
      name name
      name id
    `;
    expect(() => new ItmGridDef({template, areas})).toThrowError(/row.*start/);
    template = 'foo';
    expect(() => new ItmGridDef({template, areas})).toThrowError(/InvalidCellArea/);
    template = 'name name id name';
    expect(() => new ItmGridDef({template, areas})).toThrowError(/column.*end/);
    template = `
      name  name
      id    name
    `;
    expect(() => new ItmGridDef({template, areas})).toThrowError(/column.*start/);
    template = `
      name
      id
      name
    `;
    expect(() => new ItmGridDef({template, areas})).toThrowError(/row.*end/);
  });
});
