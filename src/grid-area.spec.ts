// tslint:disable:max-line-length
import { Map } from 'immutable';

import Area from './area';
import Grid from './grid';
import GridArea from './grid-area';
import { BehaviorSubject } from 'rxjs';

describe('ItmGridArea', () => {
  describe('parseAreas()', () => {
    const areas = Grid.parseAreas({
      [Area.selector]: [{key: 'name'}, {key: 'id'}],
      control: [{key: 'email'}]
    });

    function parseGridAreas(template: string) {
      const grid = Grid.factory.serialize({template, areas});
      return GridArea.parseGridAreas(Map(), grid, new BehaviorSubject(null));
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
        selector: Area.selector,
        key: 'id',
        row: 1,
        col: 1,
        width: 1,
        height: 2
      };
      expect(gridAreas[0].position.toJS()).toEqual(expectedIdPos, 'Expected same grid area with key id');
      const expectedNamePos = {
        selector: Area.selector,
        key: 'name',
        row: 1,
        col: 3,
        width: 2,
        height: 2
      };
      expect(gridAreas[1].position.toJS()).toEqual(expectedNamePos, 'Expected same grid area with key name');
      const expectedEmailPos = {
        selector: 'control',
        key: 'email',
        row: 2,
        col: 2,
        width: 1,
        height: 1
      };
      // tslint:disable-next-line:max-line-length
      expect(gridAreas[2].position.toJS()).toEqual(expectedEmailPos, 'Expected same grid area with key email');
    });
  });
});
