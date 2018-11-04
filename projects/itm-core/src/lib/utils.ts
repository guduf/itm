import { Map, Record, Stack, Seq } from 'immutable';

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
  [Symbol.iterator](): IterableIterator<[keyof TProps, TProps[keyof TProps]]> { return this[Symbol.iterator](); }
}

export function isEnumIncludes(target: any, val: any): boolean {
  return Array.from(Object.values(target)).includes(val);
}

export function mapOrArray<M extends Map<any, T>, T>(val: M | T[], prop: keyof T): M {
  return (
    Map.isMap(val) ? val :
    !Array.isArray(val) ? Map() as M :
      val.reduce<M>(
        (acc, v) => {
          const key = v[prop];
          if (typeof key === 'undefined' || key === null) throw new TypeError('Excepted key');
          return acc.set(key, v);
        },
        Map() as M
      )
  );
}
