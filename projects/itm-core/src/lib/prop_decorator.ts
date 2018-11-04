import { Map } from 'immutable';

import Prop from './prop';
import PropFactory from './prop_factory';

// tslint:disable-next-line:max-line-length
export function ItmPropDecorator<T extends Object = {}>(cfg: Prop.Config<T> = {}): PropertyDecorator {
  return (proto: any, key: string) => {
    if (typeof key !== 'string') return;
    let props: Map<string, Prop> = Reflect.get(proto, ItmPropDecorator.MAP_META);
    if (!props) (props = Map());
    const record = PropFactory({key}, cfg);
    Reflect.set(proto, ItmPropDecorator.MAP_META, props.set(key, record));
  };
}

export module ItmPropDecorator {
  export const MAP_META = Symbol('ITM_PROPS_META');

  export function get<T extends Object = {}>(target: any): Map<string, Prop<T>> {
    return Reflect.get(target.prototype, MAP_META);
  }
}

export default ItmPropDecorator;
