import { Map } from 'immutable';

import Prop from './prop';
import PropDecorator from './prop_decorator';
import Type from './type';
import TypeFactory from './type_factory';


export function ItmTypeDecorator<I extends Object = {}>(cfg: Type.Config<I> = {}): ClassDecorator {
  return (target: any) => {
    const props: Map<string, Prop> = PropDecorator.get(target);
    Reflect.set(target, ItmTypeDecorator.ITM_TYPE_META, TypeFactory({target, props}, cfg));
  };
}

export module ItmTypeDecorator {
  export const ITM_TYPE_META = Symbol('ITM_TYPE_META');

  export function get<I extends Object = {}>(target: any): Type<I> {
    return Reflect.get(target, ITM_TYPE_META);
  }
}

export default ItmTypeDecorator;
