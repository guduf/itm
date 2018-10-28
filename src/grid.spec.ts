// tslint:disable:max-line-length
import Area from './area';
import Grid from './grid';
import { List } from 'immutable';

describe('ItmGrid', () => {
  describe('factory', () => {
    it('should create with minimal config', () => {
      expect(Grid.factory.serialize({template: 'name', areas: [{key: 'name'}]})).toBeTruthy();
    });

    it('should create with simple template', () => {
      expect(Grid.factory.serialize({template: 'id', areas: [{key: 'id'}]})).toBeTruthy();
    });

    const areas: Area.Config[] = [{key: 'id'}, {key: 'name'}, {key: 'email'}];

    it('should create a single line template', () => {
      const def = Grid.factory.serialize({template: 'id = id name', areas});
      const expectedTemplate = {
        0: {0: [null, 'id'], 1: [null, 'id'], 2: [null, 'id'], 3: [null, 'name']}
      };
      expect(def.template.toJS()).toEqual(expectedTemplate);
    });

    it('should create a multi line template', () => {
      const areasDef = areas.map(cfg => Area.factory.serialize(cfg));
      const template = `
        id  .             name =
        id  control:email name =
      `;
      const def = Grid.factory.serialize({
        template, areas:
        {[Area.factory.selector]: areasDef, control: [areasDef[2]]}
      });
      const expectedTemplate = {
        0: {0: [null, 'id'], 1: null, 2: [null, 'name'], 3: [null, 'name']},
        1: {0: [null, 'id'], 1: ['control', 'email'], 2: [null, 'name'], 3: [null, 'name']}
      };
      expect(def.template.toJS()).toEqual(expectedTemplate, 'Expected same template');
    });
  });

  describe('parsePositions()', () => {
    const areas = Grid.parseAreas({
      [Area.factory.selector]: [{key: 'name'}, {key: 'id'}],
      control: [{key: 'email'}]
    });

    function parseGridAreas(template: string) {
      const grid = Grid.factory.serialize({template, areas});
      return Grid.parsePositions(grid.template);
    }

    it('should throw a type error when template is invalid', () => {
      let template = `
        name name
        name id
      `;
      expect(() => parseGridAreas(template)).toThrowError(/row.*start/);
      template = 'name name id name';
      expect(() => parseGridAreas(template)).toThrowError(/column.*end/);
      template = `
        name  name
        id    name
      `;
      expect(() => parseGridAreas(template)).toThrowError(/column.*start/);
      template = `
        name
        id
        name
      `;
      expect(() => parseGridAreas(template)).toThrowError(/row.*end/);
    });

    it('should set expected positions', () => {
      const template = `
        id  .             name =
        id  control:email name =
      `;
      const gridAreas = parseGridAreas(template).toSet().toArray();
      const expectedIdPos = {
        selector: Area.factory.selector,
        key: 'id',
        row: 1,
        col: 1,
        width: 1,
        height: 2
      };
      expect(gridAreas[0].toJS()).toEqual(expectedIdPos, 'Expected same grid area with key id');
      const expectedNamePos = {
        selector: Area.factory.selector,
        key: 'name',
        row: 1,
        col: 3,
        width: 2,
        height: 2
      };
      expect(gridAreas[1].toJS()).toEqual(expectedNamePos, 'Expected same grid area with key name');
      const expectedEmailPos = {
        selector: 'control',
        key: 'email',
        row: 2,
        col: 2,
        width: 1,
        height: 1
      };
      // tslint:disable-next-line:max-line-length
      expect(gridAreas[2].toJS()).toEqual(expectedEmailPos, 'Expected same grid area with key email');
    });
  });

  describe('isAreaFragment()', () => {
    it('should be true with a valid list', () => {
      expect(Grid.isAreaFragment(List([null, 'id']))).toBeTruthy();
    });
  });
});
