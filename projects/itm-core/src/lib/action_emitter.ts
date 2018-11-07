import { combineLatest, isObservable, Observable, of, Subject, Subscription } from 'rxjs';
import { distinctUntilKeyChanged, filter, map } from 'rxjs/operators';
import { Map } from 'immutable';

import Action from './action';
import Behavior from './behavior';

// tslint:disable-next-line:max-line-length
export class ItmActionEmitter<A extends Action<T> = Action<T>, T extends Object = {}> {
  /** Emitted action flow. */
  get action(): Observable<A & Action<T>> { return this._action as Observable<A & Action<T>>; }

  /** Emitted action subject. */
  private readonly _actionSub = new Subject<Action<T>>();

  /** Pending action resolutions. */
  private _resolveSubscrs = Map<Action.Unresolved<T>, Subscription>();

  /** see [[ItmActionEmitter.action]]. */
  private readonly _action: Observable<A> = this._initAction();

  constructor(
    /** Action target behavior. */
    readonly target: Behavior<T>,
    /** Action resolvers flow. */
    readonly resolvers: Observable<Action.Resolvers<T>> = of(Map())
  ) { }

  /**
   * Builds and emits a unresolved action.
   * @param key Action key
   * @param nativeEvent Optionnal action native event - eg: MouseEvent
   */
  emit(key: string, nativeEvent?: any): void {
    if (!key || typeof key !== 'string') throw new TypeError('Expected key');
    this._actionSub.next(
      new Action.Unresolved({key, nativeEvent, target: this.target.value})
    );
  }

  /**
   * Emits a resolved action.
   * @param action Resolved action that extends generic action.
   */
  emitAction(action: A & Action.Resolved<T>): void {
    if (
      !(action instanceof Action.Generic) ||
      !action.resolved &&
      typeof action.result === 'undefined'
    ) throw new TypeError('Expected resolved action');
    this._actionSub.next(action as Action.Resolved<T>);
  }

  /** Unsubscribes action subject and resolvers flow. */
  unsubscribe(): void {
    this._actionSub.unsubscribe();
    this._resolveSubscrs.forEach(subscr => subscr.unsubscribe());
  }

  /** Inits action flow. */
  private _initAction(): Observable<A> {
    return combineLatest(this._actionSub, this.resolvers).pipe(
      distinctUntilKeyChanged('0'),
      filter(([action, mapper]: [Action.Unresolved<T>, Action.Resolvers<T>]) => {
        if (action.resolved) return true;
        const resolver = mapper.get(action.key);
        if (!resolver) return true;
        // tslint:disable-next-line:max-line-length
        if (this._resolveSubscrs.has(action)) throw new ReferenceError('Duplicate action subscription');
        let primitiveResult: any;
        try { primitiveResult = resolver(action); }
        catch (err) {
          console.error(err);
          this._actionSub.next(new Action.Failed(action, err) as any);
          return;
        }
        const resultObs = isObservable(primitiveResult) ? primitiveResult : of(primitiveResult);
        this._resolveSubscrs = this._resolveSubscrs.set(action, resultObs.subscribe(
          result => {
            this._resolveSubscrs.get(action, {unsubscribe: (() => {})}).unsubscribe();
            this._actionSub.next(new Action.Resolved(action, result) as any);
          },
          err => {
            this._resolveSubscrs.get(action, {unsubscribe: (() => {})}).unsubscribe();
            this._actionSub.next(new Action.Failed(action, err) as any);
          }
        ));
      }),
      map(([action]) => action as A),
    );
  }
}

export default ItmActionEmitter;
