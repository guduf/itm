import { Subscription, Subject, Observable, of, combineLatest } from 'rxjs';
import { distinctUntilKeyChanged, filter, map } from 'rxjs/operators';
import { Map } from 'immutable';

import Action from './action';
import Behavior from './behavior';

// tslint:disable-next-line:max-line-length
export class ItmActionEmitter<A extends Action.Generic<T> = Action.Generic<T>, T extends Object = {}> {
  private _subscrs = Map<Action.Unresolved, Subscription>();

  private readonly _subject = new Subject<A>();

  private readonly _actions: Observable<A>;

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
          this._subscrs = this._subscrs.set(action, resolver(action).subscribe(
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

  actions(): Observable<A> { return this._actions; }

  unsubscribe(): void {
    this._subject.unsubscribe();
    this._subscrs.forEach(subscr => subscr.unsubscribe());
  }
}

export default ItmActionEmitter;
