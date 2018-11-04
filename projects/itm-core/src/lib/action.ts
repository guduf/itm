import { Map } from 'immutable';
import { Observable } from 'rxjs';

// tslint:disable-next-line:max-line-length
export type ItmAction<T extends Object = {}> = ItmAction.Resolved<T> | ItmAction.Failed<T> | ItmAction.Unresolved<T>;

export module ItmAction {
  /** Abstract action event. */
  export abstract class Generic<T extends Object = {}> {
    /** Action key. */
    readonly key: string;

    /** Action target. */
    readonly target: T;

    /** Action native event. */
    readonly nativeEvent?: any;

    /** Whether action is resolved. */
    abstract readonly resolved: boolean;

    /** Whether action is failed. */
    abstract readonly failed: boolean;

    constructor(action: { key: string, target: T, nativeEvent?: any }) {
      Object.assign(this, action);
    }
  }

  /** Action event without registred resolver. */
  export class Unresolved<T extends Object = {}> extends Generic<T> {
    get resolved(): false { return false; }
    get failed(): false { return false; }
  }

  /** Resolved action event. */
  export class Resolved<T extends Object = {}, R extends Object = {}> extends Generic<T> {
    get resolved(): true { return true; }
    get failed(): false { return false; }

    constructor(
      action: Unresolved<T>,
      /** Action result. */
      readonly result: R
    ) {
      super(action);
    }
  }

  /** Failed action event. */
  export class Failed<T extends Object = {}> extends Generic<T> {
    get resolved(): true { return true; }
    get failed(): true { return true; }

    constructor(
      action: Unresolved<T>,
      /** Action error. */
      readonly error: Error
    ) {
      super(action);
    }
  }

  export type Resolver<T extends Object = {}, R extends Object = {}> = (
    (action: Unresolved<T>) => Observable<R>
  );

  export type Resolvers<T extends Object = {}> = Map<string, Resolver<T> | null>;
}

// tslint:disable-next-line:max-line-length
export default ItmAction;
