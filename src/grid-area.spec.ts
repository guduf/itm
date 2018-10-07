import Area from './area';
import Grid from './grid';
import GridArea from './grid-area';

describe('ItmGridArea', () => {
  describe('parseAreas()', () => {
    const areas = Grid.parseAreas({
      [Area.selector]: [{key: 'name'}, {key: 'id'}],
      control: [{key: 'email'}]
    });

    it('should throw a type error when template is invalid', () => {
      let template = Grid.parseTemplate(`
        name name
        name id
      `);
      expect(() => GridArea.parseGridAreas(template, areas)).toThrowError(/row.*start/);
      template = Grid.parseTemplate('name name id name');
      expect(() => GridArea.parseGridAreas(template, areas)).toThrowError(/column.*end/);
      template = Grid.parseTemplate(`
        name  name
        id    name
      `);
      expect(() => GridArea.parseGridAreas(template, areas)).toThrowError(/column.*start/);
      template = Grid.parseTemplate(`
        name
        id
        name
      `);
      expect(() => GridArea.parseGridAreas(template, areas)).toThrowError(/row.*end/);
    });

    it('should set expected positions', () => {
      const template = Grid.parseTemplate(`
        id  .             name =
        id  control:email name =
      `);
      const gridAreas = GridArea.parseGridAreas(template, areas).toArray();
      const expectedIdPos = {
        area: areas.getIn([Area.selector, 'id']).toJS(),
        selector: Area.selector,
        key: 'id',
        row: 1,
        col: 1,
        width: 1,
        height: 2
      };
      expect(gridAreas[0].toJS()).toEqual(expectedIdPos, 'Expected same grid area with key id');
      const expectedNamePos = {
        area: areas.getIn([Area.selector, 'name']).toJS(),
        selector: Area.selector,
        key: 'name',
        row: 1,
        col: 3,
        width: 2,
        height: 2
      };
      expect(gridAreas[1].toJS()).toEqual(expectedNamePos, 'Expected same grid area with key name');
      const expectedEmailPos = {
        area: areas.getIn(['control', 'email']).toJS(),
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
});
