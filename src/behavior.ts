import { OnChanges, OnDestroy, SimpleChange } from '@angular/core';
import { BehaviorSubject, defer, of, Observable } from 'rxjs';
import { distinctUntilChanged, map, merge } from 'rxjs/operators';


export abstract class ItmBehavior<T> extends Observable<T>  {
  abstract value: T;

  abstract getValue(): T;
}

export module ItmBehavior {
  export function create<T>(parent: ItmBehavior<any>, ...path: any[]): ItmBehavior<T> {
    if (!(parent instanceof Observable && typeof parent.getValue === 'function'))
      throw new TypeError('Expected ItmBehavior');
    return path.length ? new StaticBehavior(parent, ...path) : parent;
  }

  export function getValue<T>(parent: ItmBehavior<T>, path?: string[]): T {
    if (!path) return parent.getValue();
    return path.reduce(
      (acc, key) => (
        typeof acc === 'object' && typeof acc['get'] === 'function' ? acc['get'](key) : acc[key]
      ),
      parent.getValue()
    );
  }
}

export class StaticBehavior<T> extends Observable<T> implements ItmBehavior<T> {
  get value(): T { return this.getValue(); }

  private readonly _parent: ItmBehavior<T> | BehaviorSubject<any>;

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

  getValue(): T { return ItmBehavior.getValue(this._parent, this._path); }
}

// tslint:disable-next-line:max-line-length
export abstract class WithBehaviors<T extends { [key: string]: any } = {}> implements OnChanges, OnDestroy {
  private readonly _subject: BehaviorSubject<T>;

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
