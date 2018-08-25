import { Observable } from 'rxjs';

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
