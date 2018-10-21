import { BehaviorSubject, Observable, of, defer as rxDefer, isObservable, empty } from 'rxjs';
import { distinctUntilChanged, mergeMap, filter, map as rxMap } from 'rxjs/operators';

export abstract class ItmTarget<T extends Object = {}> extends BehaviorSubject<T> { }

export module ItmTarget {
  export type PipeLike<T = void, R = {}> = (
    R | ((target: T) => (R | Observable<R>))
  );

  export type Pipe<T = void, R = {}> = ((target: T) => Observable<R>);

  // tslint:disable-next-line:max-line-length
  export function defer<T>(type: 'boolean', pipe: PipeLike<T, boolean>): Pipe<T, boolean> | null;

  // tslint:disable-next-line:max-line-length
  export function defer<T>(type: 'number', pipe: PipeLike<T, number>): Pipe<T, number> | null;

  // tslint:disable-next-line:max-line-length
  export function defer<T>(type: 'string', pipe: PipeLike<T, string>): Pipe<T, string> | null;

  export function defer<T, R = {}>(type: any, pipe: PipeLike<T, R>): Pipe<T, R> | null;

  export function defer(type: any, pipe: PipeLike): Pipe | null {
    if (!(
      ['boolean', 'number', 'string'].includes(type) ||
      ['object', 'function'].includes(typeof type)
    )) throw new Error('Invalid type');
    if (pipe === null) return null;
    const values = typeof type === 'object' ? Array.from(Object.values(type)) : null;
    const err = new TypeError(`Expected ${type}`);
    const test = (val: any): any  => {
      if (val === null) return val;
      if (!(
        typeof type === 'string' ? typeof val === type :
        values ? values.includes(type) :
          val instanceof type
      )) {
        console.error('DEFER_ERROR', 'value:', val, 'error:', err);
        throw new TypeError(err.message);
      }
      return val;
    };
    if (typeof pipe !== 'function') {
      const val: any = test(pipe);
      return () => of(val);
    }
    return target => rxDefer(() => {
      let val: any;
      try { val = (pipe as (target: any) => any)(target); }
      catch (err) { console.error(err); }
      return isObservable(val) ? val.pipe(rxMap(test)) : of(test(val));
    });
  }

  export function map<T = void, R = {}>(target: Observable<T>, pipe?: Pipe<T, R>): Observable<R> {
    return target.pipe(mergeMap(val => pipe(val)));
  }
}

export default ItmTarget;
