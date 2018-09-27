import { Iterable, Set } from 'immutable';

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

export type SetLike<T = {}> = T[] | Set<T> | Map<any, T> | Iterable<any, T>;


export function parseSet<T = {}, C = {}>(cfg: SetLike<C>, ctor: { new(cfg: C): T }): Set<T> {
  return (
    !cfg ? Set<T>() :
    Iterable<C>(cfg)
      .map(c => c instanceof ctor ? c : new ctor(c))
      .toSet()
  );
}
