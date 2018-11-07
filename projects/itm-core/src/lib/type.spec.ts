import { Map } from 'immutable';

import Prop from './prop';
import PropFactory from './prop_factory';
import TypeFactory from './type_factory';
import ItmReflector, { ItmTypeDecorator, ItmPropDecorator } from './reflector';

class User { name: string; }
const props = Map<string, Prop>();
props.set('name', PropFactory({key: 'name'}, {}));

describe('ItmTypeDef', () => {
  it('should create with minimal config', () => {
    expect(TypeFactory({target: User, props}));
  });
});

describe('ItmType', () => {
  it('should decorate the item type class', () => {
    const expectedKey = 'user';
    @ItmTypeDecorator({key: expectedKey})
    class Person { }
    const [typeDef] = ItmReflector.getTypes(Person);
    expect(TypeFactory().isFactoryRecord(typeDef)).toBeTruthy('Expected ItmTypeDef');
    expect(typeDef.key).toBe(expectedKey);
  });
});

describe('ItmProp', () => {
  it('should decorate the item prop method', () => {
    const expectedKey = 'firstName';
    class Person { name: string; }
    ItmPropDecorator({key: expectedKey})(Person.prototype, 'name');
    ItmTypeDecorator()(Person);
    const [typeDef] = ItmReflector.getTypes(Person);
    const propDef = typeDef.props.get('name');
    expect(PropFactory().isFactoryRecord(propDef)).toBeTruthy('Expected ItmPropDef');
    expect(propDef.key).toBe(expectedKey);
  });
});
