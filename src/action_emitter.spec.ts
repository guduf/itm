import { Map } from 'immutable';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

import Action from './action';
import ActionEmitter from './action_emitter';
import Behavior from './behavior';

describe('ItmActionEmitter', () => {
  function setup(
    target: Behavior<any> = new BehaviorSubject({}),
    resolvers?: Observable<Action.Resolvers>
  ): ActionEmitter {
    return new ActionEmitter(target, resolvers);
  }

  it('should create with minimal arguments', () => {
    const emitter = setup();
    expect(emitter).toBeTruthy();
    emitter.unsubscribe();
  });

  it('should build action.', () => {
    const emitter = setup();
    let e: any;
    emitter.action.subscribe(action => (e = action));
    emitter.emit('foo');
    emitter.unsubscribe();
    expect(e).toBeTruthy();
  });

  it('should throw a error with invalid key.', () => {
    const emitter = setup();
    expect(() => emitter.emit([] as any)).toThrowError(/key/);
    emitter.unsubscribe();
  });

  it('should emit resolved action.', () => {
    const emitter = setup();
    let e: any;
    emitter.action.subscribe(a => (e = a));
    const action = new Action.Resolved({key: 'foo', target: {}} as any, {});
    emitter.emitAction(action);
    emitter.unsubscribe();
    expect(action).toBe(e);
  });

  it('should throw a error with invalid action.', () => {
    const emitter = setup();
    expect(() => emitter.emitAction([] as any)).toThrowError(/action/);
    emitter.unsubscribe();
  });

  it('should resolve a action with a resolver.', () => {
    const key = 'foo';
    const target = {id: 63};
    const result = {data: 'bar'};
    const resolvers = (
      (Map() as Action.Resolvers).set(key, a => of(result))
    );
    const emitter = setup(new BehaviorSubject(target), of(resolvers));
    let e: Action.Resolved;
    emitter.action.subscribe(a => (e = a as any));
    emitter.emit(key);
    expect(e instanceof Action.Resolved).toBe(true, 'Expected Resolved Action');
    expect(e.key).toBe(key);
    expect(e.target).toBe(target);
    expect(e.result).toBe(result);
  });

  it('should fail a action with a resolver.', () => {
    const key = 'foo';
    const err = new Error('foo');
    const resolvers = (
      (Map() as Action.Resolvers).set(key, a => throwError(err))
    );
    const emitter = setup(new BehaviorSubject({}), of(resolvers));
    let e: Action.Failed;
    emitter.action.subscribe(a => (e = a as any));
    emitter.emit(key);
    expect(e instanceof Action.Failed).toBe(true, 'Expected Failed Action');
    expect(e.error).toBe(err);
  });
});
