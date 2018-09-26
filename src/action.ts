import { InjectionToken } from '@angular/core';
import { Observable, Subscriber, Subject } from 'rxjs';

import { deferPipe, ItmPipeLike, ItmPipe } from './item';

/** The token for display mode of row actions buttons. */
export const ITM_TABLE_ACTIONS_BUTTONS_MODE = new InjectionToken('ITM_TABLE_ACTIONS_BUTTONS_MODE');

/** A generic action configuration. */
export interface ItmActionConfig<T = {}> {
  /** The identifier of the actions. */
  key: string;
  /** Defines the action icon. */
  icon?: false | ItmPipeLike<T, string>;
  /** Defines the the text. */
  text?: false | ItmPipeLike<T, string>;
}

/** A generic action definition. */
export class ItmAction<T = {}> implements ItmActionConfig {
  /** see [[ItmActionConfig.key]]. */
  key: string;
  /** see [[ItmActionConfig.icon]]. */
  icon: ItmPipe<T, string>;
  /** see [[ItmActionConfig.text]]. */
  text: ItmPipe<T, string>;

  constructor(cfg: ItmActionConfig) {
    if (cfg.key && typeof cfg.key === 'string') this.key = cfg.key;
    else throw new TypeError('InvalidItmActionConfig : Expected [key] as string for event config');
    this.icon = cfg.icon === false ? null : deferPipe(cfg.icon || this.key);
    this.text = cfg.text === false ? null : deferPipe(cfg.text || this.key);
  }
}

/** A array of generic action definitions. */
// tslint:disable-next-line:max-line-length
export abstract class ItmActions<T = {}, A extends ItmAction<T> = ItmAction<T>> extends Array<A> { }

/** A generic event with a action definition, a target. */
export class ItmActionEvent<T = {}, A extends ItmAction = ItmAction> {
  /** The key of the action. */
  readonly key: string;

  /** Whether the event is completed. */
  get completed(): boolean { return this._completed; }

  /** Event error if is failed. */
  get error(): Error { return this._error; }

  /** Whether the event is failed.  */
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
    if (action instanceof ItmAction) this.key = action.key;
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

// tslint:disable-next-line:max-line-length
export class ItmActionEmitter<T = {}, A extends ItmAction = ItmAction> extends Subject<ItmActionEvent<T, A>> { }
