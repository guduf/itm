import { ItmProp, ItmPropDef, ITM_PROPS_META } from './prop';
import Type from './type';
import { Map } from 'immutable';

class User { name: string; }
const props = Map<string, ItmPropDef>();
props.set('name', new ItmPropDef('name', {}));

describe('ItmTypeDef', () => {
  it('should create with minimal config', () => {
    expect(Type.factory.serialize({target: User, props}));
  });
});

describe('ItmType', () => {
  it('should decorate the item type class', () => {
    const expectedKey = 'user';
    @Type({key: expectedKey})
    class Person { }
    const typeDef = Type.get(Person);
    expect(Type.factory.isFactoryRecord(typeDef)).toBeTruthy('Expected ItmTypeDef');
    expect(typeDef.key).toBe(expectedKey);
  });
});

describe('ItmProp', () => {
  it('should decorate the item prop method', () => {
    const expectedKey = 'firstName';
    class Person { name: string; }
    ItmProp({key: expectedKey})(Person.prototype, 'name');
    Type()(Person);
    const typeDef = Type.get(Person);
    const propDef = typeDef.props.get('name');
    expect(propDef instanceof ItmPropDef).toBeTruthy('Expected ItmPropDef');
    expect(propDef.key).toBe(expectedKey);
  });
});
