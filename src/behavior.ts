import { OnChanges, OnDestroy, SimpleChange } from '@angular/core';
import { BehaviorSubject, defer, of, Observable } from 'rxjs';
import { distinctUntilChanged, map, merge } from 'rxjs/operators';

/** Abstract observable with a behavior value. */
export abstract class ItmBehavior<T> extends Observable<T>  {
  /** Behavior value. */
  abstract value: T;

  /** Get behavior value. */
  abstract getValue(): T;
}

export module ItmBehavior {
  /** Creates a behavior from a parent behavior. */
  export function create<T>(parent: ItmBehavior<any>, ...path: any[]): ItmBehavior<T> {
    if (!(parent instanceof Observable && typeof parent.getValue === 'function'))
      throw new TypeError('Expected Behavior as parent');
    return path.length ? new StaticBehavior(parent, ...path) : parent;
  }

  /** Behavior implementation. */
  export class StaticBehavior<T> extends Observable<T> implements ItmBehavior<T> {
    /** see [[ItmBehavior.value]] */
    get value(): T { return this.getValue(); }

    /** see [[ItmBehavior.parent]].*/
    private readonly _parent: ItmBehavior<T>;

    /** Behavior path. */
    private readonly _path: any[] | null;

    constructor(parent: ItmBehavior<any>, ...path: any[]) {
      const source = parent.pipe(
        map(() => this.getValue()),
        merge(defer(() => of(this.getValue()))),
        distinctUntilChanged()
      );
      super(subscriber => source.subscribe(subscriber));
      this._parent = parent;
      this._path = path.length ? path : null;
    }

    /** Return behavior value. */
    getValue(): T { return ItmBehavior.getValue(this._parent, this._path); }
  }

  /** Get value from a behavior with a path. */
  export function getValue<T>(behavior: ItmBehavior<T>, path?: string[]): T {
    return path.reduce(
      (acc, key) => (
        typeof acc === 'object' && typeof acc['get'] === 'function' ? acc['get'](key) : acc[key]
      ),
      behavior.getValue()
    );
  }
}

/** Abstract component with behavior inputs. */
// tslint:disable-next-line:max-line-length
export abstract class WithBehaviors<T extends { [key: string]: any } = {}> implements OnChanges, OnDestroy {
  /** Subject of input changes. */
  private readonly _subject: BehaviorSubject<T>;

  /** Plain object of input behavior. */
  readonly behaviors: { [P in keyof T]: ItmBehavior<T[P]> };

  constructor(init: { [P in keyof T]: any }) {
    this._subject = new BehaviorSubject(init);
    this.behaviors = Object.keys(init).reduce(
      (acc, key) => ({...(acc as {}), [key]: ItmBehavior.create(this._subject, key)}),
      {} as { [P in keyof T]?: ItmBehavior<T[P]> }
    ) as { [P in keyof T]: ItmBehavior<T[P]> };
  }

  ngOnChanges(changes: { [P in keyof T]?: SimpleChange }) {
    const behaviorsChange = Object.keys(changes).reduce(
      (acc, key) => (
        !this.behaviors[key] ? acc : {...(acc || {} as {}), [key]: changes[key].currentValue}
      ),
      null as Partial<T>
    );
    if (!behaviorsChange) return;
    this._subject.next(Object.assign({}, this._subject.value, behaviorsChange));
  }

  ngOnDestroy() { this._subject.unsubscribe(); }
}

export default ItmBehavior;
