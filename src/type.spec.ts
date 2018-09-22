import { ItmTypeDef, ItmPropDef, ItmType, getItmTypeDef, ItmProp } from './type';

class User { name: string; }
const props = new Map<string, ItmPropDef>();
props.set('name', new ItmPropDef('name', {}));

describe('ItmTypeDef', () => {
  it('should create with minimal config', () => {
    expect(new ItmTypeDef(User, props, {}));
  });
});

describe('ItmType', () => {
  it('should decorate the item type class', () => {
    const expectedKey = 'user';
    @ItmType({key: expectedKey})
    class Person { }
    const typeDef = getItmTypeDef(Person);
    expect(typeDef instanceof ItmTypeDef).toBeTruthy('Expected ItmTypeDef');
    expect(typeDef.key).toBe(expectedKey);
  });
});

describe('ItmProp', () => {
  it('should decorate the item type class', () => {
    const expectedKey = 'firstName';
    class Person { name: string; }
    ItmProp({key: expectedKey})(Person, 'name');
    ItmType()(Person);
    const typeDef = getItmTypeDef(Person);
    expect(typeDef instanceof ItmTypeDef).toBeTruthy('Expected ItmTypeDef');
    const propDef = typeDef.getProp('name');
    expect(propDef instanceof ItmPropDef).toBeTruthy('Expected ItmPropDef');
    expect(propDef.key).toBe(expectedKey);
    expect(typeDef.getProp(expectedKey)).toBe(propDef, 'Expected same prop def with key');
  });
});
