import { Map } from 'immutable';
import { Observable } from 'rxjs';

// tslint:disable-next-line:max-line-length
export type ItmAction<T extends Object = {}> = ItmAction.Resolved<T> | ItmAction.Failed<T> | ItmAction.Unresolved<T>;

export module ItmAction {
  export abstract class Generic<T extends Object = {}> {
    readonly key: string;
    readonly target: T;
    readonly nativeEvent: any;

    abstract readonly resolved: boolean;
    abstract readonly failed: boolean;

    constructor(action: { key: string, target: T, nativeEvent: any }) {
      Object.assign(this, action);
    }
  }

  export class Unresolved<T extends Object = {}> extends Generic<T> {
    get resolved(): false { return false; }
    get failed(): false { return false; }
  }

  export class Resolved<T extends Object = {}, R extends Object = {}> extends Generic<T> {
    get resolved(): true { return true; }
    get failed(): true { return true; }

    constructor(readonly action: Unresolved<T>, readonly result: R) {
      super(action);
    }
  }

  export class Failed<T extends Object = {}> extends Generic<T> {
    get resolved(): true { return true; }
    get failed(): true { return true; }

    constructor(readonly action: Unresolved<T>, readonly error: Error) {
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
