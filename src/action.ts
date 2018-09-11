import { InjectionToken } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

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
  text?: ItmPipeLike<T, string>;
}

/** A generic action definition. */
export class ItmActionDef<T = {}> implements ItmActionConfig {
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
    this.text = deferPipe(cfg.text || this.key);
  }
}

/** A array of generic action definitions. */
export abstract class ItmActionDefs extends Array<ItmActionDef> { }

/** A generic event with a action definition, a target. */
export class ItmActionEvent<T = {}, A extends ItmActionDef = ItmActionDef> extends Observable<any> {
  /** The key of the action. */
  readonly key: string;

  /** Whether the event is proccessed. */
  get proccessed(): boolean { return this.proccessed; }

  /** Event error if is failed. */
  get error(): Error { return this._error; }

  /** Whether the event is failed.  */
  get failed(): boolean { return this._error && true; }

  /** Whether the event is succeeded. */
  get succeeded(): boolean { return this._proccessed && !this._error && true; }

  /** see [[ItmActionEvent.proccessed]]. */
  private _proccessed = false;

  /** Subscriber to complete the event. */
  private _completionSubscriber: Subscriber<void>;

  /** see [[ItmActionEvent.error]]. */
  private _error: Error;

  constructor(
    readonly action: A,
    readonly nativeEvent: any,
    readonly target: T = {} as T
  ) {
    super(subscriber => (this._completionSubscriber = subscriber));
    if (action instanceof ItmActionDef) this.key = action.key;
    else throw new TypeError('ItmActionEvent : Expected (action) as ItmActionDef');
    if (!nativeEvent) throw new TypeError('ItmActionEvent : Expected (nativeEvent)');
  }

  /** Complete the event. */
  complete(): void {
    if (this._proccessed) return;
    this._proccessed = true;
    this._completionSubscriber.next();
    this._completionSubscriber.complete();
  }

  /** Fail the event. */
  fail(err: Error): void {
    if (this._proccessed) return;
    this._error = err;
    this._proccessed = true;
    this._completionSubscriber.error(this._error);
    this._completionSubscriber.complete();
  }
}

