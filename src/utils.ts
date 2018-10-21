import { Record, Stack, Seq } from 'immutable';

/** Checks if a class as been decorated with a component template. Only works with NG5+. */
export function isComponentType(value: any): boolean {
  if (typeof value !== 'function') return false;
  try {
    if (typeof value['__annotations__'][0].template !== 'string') throw new TypeError();
  }
  catch (err) { return false; }
  return true;
}

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
  abstract [Symbol.iterator](): IterableIterator<[keyof TProps, TProps[keyof TProps]]>;
}
