import { Observable, defer, of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { InjectionToken } from '@angular/core';

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
  ((target: T) => R) | ((target: T) => Promise<R>) | ItmPipe<T, R>
);

export function deferPipe<T = void, R = {}>(pipe: ItmPipeLike<T, R>): ItmPipe<T, R> {
  if (typeof pipe === 'undefined') throw new TypeError('Expected ItmPipeLike');
  if (typeof pipe !== 'function') return () => of(pipe as R);
  return value => defer(() => {
    let res: Observable<R>;
    try { res = (pipe as ((target: T) => (Observable<R>)))(value); }
    catch (err) { console.error(err); }
    if (res instanceof Observable) res = res.pipe(distinctUntilChanged());
    else res = of(res);
    return res;
  });
}

