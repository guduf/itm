/** Checks if a class as been decorated with a component template. Only works with NG5+. */
export function isComponentType(value: any): boolean {
  try {
    if (typeof value['__annotations__'][0].template !== 'string') throw new TypeError();
  }
  catch (err) { return false; }
  return true;
}

export interface ComponentType { new(...args: any[]); }
