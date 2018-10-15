import { Subject, Observable } from 'rxjs';
import Action from './action';
import { InjectionToken } from '@angular/core';

/** A generic event with a action definition, a target. */
export class ItmActionEvent<T = {}, A extends Action = Action> {
  /** The key of the action. */
  readonly key: string;

  /** Whether the event is completed. */
  get completed(): boolean { return this._completed; }

  /** Event error if is failed. */
  get error(): Error { return this._error; }

  /** Whether the event is failed. */
  get failed(): boolean { return Boolean(this._completed && this.error); }

  /** Whether the event is succeeded. */
  get succeeded(): boolean { return Boolean(this._completed && !this._error); }

  /** see [[ItmActionEvent.completed]]. */
  private _completed = false;

  /** Subscriber to complete the event. */
  private _completionSubject = new Subject<void>();

  /** see [[ItmActionEvent.error]]. */
  private _error: Error;

  constructor(
    /** The action definition of the event. */
    readonly action: A,
    /** The native event of the event. */
    readonly nativeEvent: any,
    /** The target of the event. */
    readonly target: T = {} as T
  ) {
    if (Action.factory.isFactoryRecord(action)) this.key = action.key;
    else throw new TypeError('ItmActionEvent : Expected (action) as ItmAction');
    if (!nativeEvent) throw new TypeError('ItmActionEvent : Expected (nativeEvent)');
  }

  /** Create a observable for the completion of the event. */
  afterComplete(): Observable<void> {
    return this._completionSubject.asObservable();
  }

  /** Complete the event. */
  complete(): void {
    if (this._completed) return;
    this._completed = true;
    this._completionSubject.next();
    this._completionSubject.complete();
  }

  /** Fail the event. */
  fail(err: Error): void {
    if (this._completed) return;
    this._completed = true;
    this._error = err;
    this._completionSubject.error(this._error);
    this._completionSubject.complete();
  }
}

export module ItmActionEvent {
  // tslint:disable-next-line:max-line-length
  export type Emitter<T = {}, A extends Action<T> = Action<T>> = Subject<ItmActionEvent<T, A>>;
}

// tslint:disable-next-line:max-line-length
export const ITM_ACTION_EVENT_EMITTER_TOKEN = new InjectionToken<ItmActionEvent.Emitter>('ITM_ACTION_EVENT_EMITTER');

export default ItmActionEvent;
