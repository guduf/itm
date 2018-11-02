import { Subscription, Subject, Observable, of, combineLatest, isObservable } from 'rxjs';
import { distinctUntilKeyChanged, filter, map } from 'rxjs/operators';
import { Map } from 'immutable';

import Action from './action';
import Behavior from './behavior';

// tslint:disable-next-line:max-line-length
export class ItmActionEmitter<A extends Action.Generic<T> = Action.Generic<T>, T extends Object = {}> {
  get action(): Observable<A> { return this._actions; }

  private readonly _subject = new Subject<A>();

  private readonly _actions: Observable<A>;

    private _subscrs = Map<Action.Unresolved, Subscription>();

  constructor(
    private readonly _target: Behavior<T>,
    readonly resolvers: Observable<Action.Resolvers<T>> = of(Map())
  ) {
    this._actions = (
      combineLatest<Action.Unresolved, Action.Resolvers>(this._subject, resolvers).pipe(
        distinctUntilKeyChanged('0'),
        filter(([action, mapper]) => {
          if (action.resolved) return true;
          const resolver = mapper.get(action.key);
          if (!resolver) return true;
          // tslint:disable-next-line:max-line-length
          if (this._subscrs.has(action)) throw new ReferenceError('Duplicate action subscription');
          let primitiveResult: any;
          try { primitiveResult = resolver(action); }
          catch (err) {
            console.error(err);
            this._subject.next(new Action.Failed(action, err) as any);
            return;
          }
          const resultObs = isObservable(primitiveResult) ? primitiveResult : of(primitiveResult);
          this._subscrs = this._subscrs.set(action, resultObs.subscribe(
            result => {
              this._subscrs.get(action, {unsubscribe: (() => {})}).unsubscribe();
              this._subject.next(new Action.Resolved(action, result) as any);
            },
            err => {
              this._subscrs.get(action, {unsubscribe: (() => {})}).unsubscribe();
              this._subject.next(new Action.Failed(action, err) as any);
            }
          ));
        }),
        map(([action]) => action as A)
      )
    );
  }

  emit(key: string, nativeEvent?: any): void {
    if (!key || typeof key !== 'string') throw new TypeError('Expected key');
    this._subject.next(
      new Action.Unresolved({key, nativeEvent, target: this._target.value}) as A
    );
  }

  emitAction(action: A & Action.Resolved<T>): void {
    if (
      !(action instanceof Action.Generic) ||
      !action.resolved &&
      typeof action.result === 'undefined'
    ) throw new TypeError('Expected resolved action');
    this._subject.next(action);
  }

  unsubscribe(): void {
    this._subject.unsubscribe();
    this._subscrs.forEach(subscr => subscr.unsubscribe());
  }
}

export default ItmActionEmitter;
