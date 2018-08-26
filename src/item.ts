import { Observable, defer, of, empty } from 'rxjs';
import { tap, distinctUntilChanged } from 'rxjs/operators';

/** Represents the generic item used this module. */
export abstract class Itm {
  /** The primary key of the item. */
  id: string | number;

  [key: string]: any;
}

/** Represents a array of generic items. */
export abstract class Itms<I extends Itm = Itm> extends Array<I> { }

/** Represents a observable of a array of generic items. */
export abstract class ItmsChanges<I extends Itm = Itm> extends Observable<I[]> { }

/** Represents a observable or a value of a array of generic items. */
export type ItmsSource<I extends Itm = Itm> = Itms<I> | ItmsChanges<I>;

/** Data for the injected ItmColumnDef for ItmDefaultCellComponent. */
export type ItmGenericValuePipe<
  T extends K | Observable<K>,
  U extends  I | Itms<I>,
  K = {},
  I extends Itm = Itm
> = (
  (item: U) => T
);

// tslint:disable:max-line-length
export type ItmValuePipe<K = {}, I extends Itm = Itm> = ItmGenericValuePipe<Observable<K>, I>;
export type ItmsValuePipe<K = {}, I extends Itm = Itm> = ItmGenericValuePipe<Observable<K>, Itms<I>>;
export type ItmValueSoftPipe<K = {}, I extends Itm = Itm> = ItmGenericValuePipe<K | Observable<K>, I>;
export type ItmsValueSoftPipe<K = {}, I extends Itm = Itm> = ItmGenericValuePipe<K | Observable<K>, Itms<I>>;
// tslint:enable:max-line-length

export function deferValuePipe<U extends I | Itms<I>, K, I extends Itm = Itm>(
  pipe: ItmGenericValuePipe<K | Observable<K>, U, K, I>
): ItmGenericValuePipe<Observable<K>, U, K, I> {
  if (typeof pipe !== 'function') return () => empty();
  return value => defer(() => {
    let res: Observable<K>;
    try { res = (pipe as ((value: U) => (Observable<K>)))(value); }
    catch (err) { console.error(err); }
    if (res instanceof Observable) res = res.pipe(distinctUntilChanged());
    else res = of(res);
    return res;
  });
}

