import { InjectionToken } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

/** Represents the generic item used this module. */
export abstract class Itm {
  /** The primary key of the item. */
  id: string | number;

  [key: string]: any;
}

export const ITM_TARGET = new InjectionToken('ITM_TARGET');

export abstract class Itms<I extends Itm = Itm> extends Array<I> { }

/** Represents a observable of a array of generic items. */
export abstract class ItmsChanges<I extends Itm = Itm> extends Observable<I[]> { }

/** Represents a observable or a value of a array of generic items. */
export type ItmsSource<I extends Itm = Itm> = I[] | ItmsChanges<I>;

/** Data for the injected ItmColumn for ItmCellComponent. */
export type ItmPipe<T = void, R = void> = (target: T) => Observable<R>;

export type ItmPipeLike<T = void, R = {}> = (
  R | ((target: T) => R) | ItmPipe<T, R>
);

// tslint:disable-next-line:max-line-length
export function deferPipe<T = void, R = {}>(pipe: (target: T) => (R | Observable<R>) ): ItmPipe<T, R> {
  if (typeof pipe === 'undefined') throw new TypeError('Expected ItmPipeLike');
  if (typeof pipe !== 'function') return () => of(pipe as R);
  return value => defer(() => {
    let res: any;
    try { res = (pipe as (target: T) => any)(value); }
    catch (err) { console.error(err); }
    if (res instanceof Observable) res = res.pipe(distinctUntilChanged());
    else res = of(res);
    return res;
  });
}

// tslint:disable-next-line:max-line-length
export function fromStringPipe<T = void>(pipe: ItmPipeLike<T, string>, target: T): Observable<string> {
  return (
    typeof pipe === 'string' ? of(pipe) :
    typeof pipe === 'function' ? deferPipe(pipe)(target) :
      of(null)
  );
}

