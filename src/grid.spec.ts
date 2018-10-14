// tslint:disable:max-line-length
import Area from './area';
import Grid from './grid';

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
    const expectedTemplate = {0: {0: 'id', 1: 'id', 2: 'id', 3: 'name'}};
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
      {[Area.selector]: areasDef, control: [areasDef[2]]}
    });
    const expectedTemplate = {
      0: {0: 'id', 1: null, 2: 'name', 3: 'name'},
      1: {0: 'id', 1: 'control:email', 2: 'name', 3: 'name'}
    };
    expect(def.template.toJS()).toEqual(expectedTemplate, 'Expected same template');
  });
});
