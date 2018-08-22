/** Checks if a object is a class object with constructor. */
export function isConstructor(value: any): boolean {
  return typeof value === 'function' && /^\s*class\s+/.test(value.toString());
}

/** A class object declared as entry component. */
export type CmpClass = any;

/** A plain object used as data for ItmColumn. */
export interface ItmColumnData { [key: string]: any; }
