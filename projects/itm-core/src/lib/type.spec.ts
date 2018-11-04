import { Map } from 'immutable';

import Prop from './prop';
import PropDecorator from './prop_decorator';
import PropFactory from './prop_factory';
import Type from './type';
import TypeFactory from './type_factory';
import TypeDecorator from './type_decorator';

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
    @TypeDecorator({key: expectedKey})
    class Person { }
    const typeDef = TypeDecorator.get(Person);
    expect(TypeFactory().isFactoryRecord(typeDef)).toBeTruthy('Expected ItmTypeDef');
    expect(typeDef.key).toBe(expectedKey);
  });
});

describe('ItmProp', () => {
  it('should decorate the item prop method', () => {
    const expectedKey = 'firstName';
    class Person { name: string; }
    PropDecorator({key: expectedKey})(Person.prototype, 'name');
    TypeDecorator()(Person);
    const typeDef = TypeDecorator.get(Person);
    const propDef = typeDef.props.get('name');
    expect(PropFactory().isFactoryRecord(propDef)).toBeTruthy('Expected ItmPropDef');
    expect(propDef.key).toBe(expectedKey);
  });
});
