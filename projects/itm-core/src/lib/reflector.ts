import 'reflect-metadata';

import { FactoryProvider } from '@angular/core';
import { Map } from 'immutable';

import Prop from './prop';
import PropFactory from './prop_factory';
import { ITM_INIT } from './registrer';
import Type from './type';
import TypeFactory from './type_factory';

export const ITM_PROPS_META = Symbol('ITM_PROPS_META');

export const ITM_TYPE_META = Symbol('ITM_TYPE_META');

// tslint:disable-next-line:max-line-length
export function ItmPropDecorator<T extends Object = {}>(cfg: Prop.Config<T> = {}): PropertyDecorator {
  return (proto: any, key: string) => {
    if (typeof key !== 'string') return;
    let props: Map<string, Prop> = Reflect.get(proto, ITM_PROPS_META);
    if (!props) (props = Map());
    const record = PropFactory({key}, cfg);
    Reflect.set(proto, ITM_PROPS_META, props.set(key, record));
  };
}

export function ItmTypeDecorator<I extends Object = {}>(cfg: Type.Config<I> = {}): ClassDecorator {
  return (target: any) => {
    const props: Map<string, Prop> = Reflect.get(target.prototype, ITM_PROPS_META);
    Reflect.set(target, ITM_TYPE_META, TypeFactory({target, props}, cfg));
  };
}

export module ItmReflector {
  class ReflectError extends Error {
    constructor(msg: string, readonly failed: any[], readonly success: Type[]) {
        super(`REFLECT_ERROR: ${msg}`);
        Object.setPrototypeOf(this, ReflectError.prototype);
    }
  }

  export function getTypes(...targets: any[]): Type[] {
    const failed: any[] = [];
    const records = targets.map(target => {
      const record = Reflect.get(target, ITM_TYPE_META);
      try {
        if (!record) throw new ReferenceError('Missing meta');
        // tslint:disable-next-line:max-line-length
        if (!TypeFactory().isFactoryRecord(record)) throw new ReferenceError('Excepted type record');
      } catch (err) {
        console.error(err);
        failed.push(target);
        return null;
      }
      return record;
    });
    // tslint:disable-next-line:max-line-length
    if (failed.length) throw new ReflectError('type', failed, records.filter(record => Boolean(record)));
    return records;
  }

  export function provide(...targets: any[]): FactoryProvider {
    function useFactory() {
      try { return {types: getTypes(...targets)}; }
      catch (err) {
        if (!(err instanceof ReflectError))throw err;
        console.error(err);
        return {types: err.success};
      }
    }
    return {provide: ITM_INIT, multi: true, useFactory};
  }
}

export default ItmReflector;
