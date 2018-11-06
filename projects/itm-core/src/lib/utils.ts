import { Map, Record, Stack, Seq, isCollection, Collection } from 'immutable';

export interface ComponentType { new(...args: any[]); }

export type StackLike<T = {}> = T[] | Stack<T>;

export abstract class AbstractRecord<TProps extends Object = {}> implements Record<TProps> {
  abstract has(key: string): key is keyof TProps & string;
  abstract get<K extends keyof TProps>(key: K, notSetValue?: any): TProps[K];
  abstract get<T>(key: string, notSetValue: T): T;
  abstract hasIn(keyPath: Iterable<any>): boolean;
  abstract getIn(keyPath: Iterable<any>): any;
  abstract equals(other: any): boolean;
  abstract hashCode(): number;
  abstract set<K extends keyof TProps>(key: K, value: TProps[K]): this;
  abstract update<K extends keyof TProps>(key: K, updater: (value: TProps[K]) => TProps[K]): this;
  abstract merge(...collections: Array<Partial<TProps> | Iterable<[string, any]>>): this;
  abstract mergeDeep(...collections: Array<Partial<TProps> | Iterable<[string, any]>>): this;
  abstract mergeWith(
    merger: (oldVal: any, newVal: any, key: keyof TProps) => any,
    ...collections: Array<Partial<TProps> | Iterable<[string, any]>>
  ): this;
  abstract mergeDeepWith(
    merger: (oldVal: any, newVal: any, key: any) => any,
    ...collections: Array<Partial<TProps> | Iterable<[string, any]>>
  ): this;
  abstract delete<K extends keyof TProps>(key: K): this;
  abstract remove<K extends keyof TProps>(key: K): this;
  abstract clear(): this;
  abstract setIn(keyPath: Iterable<any>, value: any): this;
  abstract updateIn(keyPath: Iterable<any>, updater: (value: any) => any): this;
  abstract mergeIn(keyPath: Iterable<any>, ...collections: Array<any>): this;
  abstract mergeDeepIn(keyPath: Iterable<any>, ...collections: Array<any>): this;
  abstract deleteIn(keyPath: Iterable<any>): this;
  abstract removeIn(keyPath: Iterable<any>): this;
  abstract toJS(): { [K in keyof TProps]: any };
  abstract toJSON(): TProps;
  abstract toObject(): TProps;
  abstract withMutations(mutator: (mutable: this) => any): this;
  abstract asMutable(): this;
  abstract wasAltered(): boolean;
  abstract asImmutable(): this;
  abstract toSeq(): Seq.Keyed<keyof TProps, TProps[keyof TProps]>;
  // tslint:disable-next-line:max-line-length
  [Symbol.iterator](): IterableIterator<[keyof TProps, TProps[keyof TProps]]> { return; }
}

export function checkType(check: any, val: any): boolean {
  if (typeof val === 'undefined') throw new TypeError('Expected value');
  if (val === null) return true;
  if (['string', 'function', 'number', 'boolean'].includes(check)) return typeof val === check;
  if (typeof check === 'function') return val instanceof check;
  if (Array.isArray(check)) return check.includes(val);
  if (typeof check === 'object') return Array.from(Object.values(check)).includes(val);
  throw new TypeError('Invalid check type');
}

export function checkTypeOrThrow(check: any, val: any): void {
  if (checkType(check, val)) return;
  let msg: string;
  if (['string', 'function', 'number', 'boolean'].includes(check)) msg = `type of ${check}`;
  else if (typeof check === 'function') msg = `instance of ${check.name}`;
  else msg = `in [${Array.from(Object.values(check)).join(', ')}]`;
  console.log({check, val, msg});
  throw new TypeError('Expected ' + msg);
}

// tslint:disable-next-line:max-line-length
export function parseIter<V extends Object, R extends Object>(iter: Collection<any, V> | V[], prop: keyof V, predicate: (val: V) => R): Map<string, R>;
// tslint:disable-next-line:max-line-length
export function parseIter<V extends Object>(iter: Collection<any, V> | V[], prop: keyof V, predicate?: (val: V) => void): Map<string, V>;
export function parseIter<M extends Map<K, R>, R extends Object, K, V extends Object>(
  iter: Collection<K, R> | V[],
  prop: keyof R,
  predicate?: (val: V) => R | void,
  init: M = Map() as any as M
): M {
  const collec = (isCollection(iter) ? iter : Collection(iter)) as Collection<any, V>;
  return collec.reduce(
    (acc, val) => {
      const res: any = predicate ? predicate(val) || val : val;
      if (typeof res !== 'object') throw new TypeError('Expected object');
      return acc.set(res[prop], res);
    },
    init
  );
}
