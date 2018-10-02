import Action from './action';
import ActionEvent from './action-event';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ItmActionEvent', () => {
  const expectedAction = Action.factory.serialize({key: 'create'});
  const expectedEvent = {} as Event;
  const expectedTarget = {};

  it('should create with a valid minimal config', () => {
    const e = new ActionEvent(expectedAction, expectedEvent, expectedTarget);
    expect(e.action).toBe(expectedAction);
    expect(e.nativeEvent).toBe(expectedEvent);
    expect(e.target).toBe(expectedTarget);
  });

  it('should throw type error with invalid config', () => {
    expect(() => new ActionEvent({} as Action.Record, expectedEvent)).toThrowError(TypeError);
    expect(() => new ActionEvent(expectedAction, null)).toThrowError(TypeError);
  });

  it('should be completed after the complete method is called', () => {
    const e = new ActionEvent(expectedAction, expectedEvent);
    expect(e.completed).toBe(false, 'Expected completed to be false after create');
    e.complete();
    expect(e.completed).toBe(true, 'Expected completed to be true after complete');
    expect(e.failed).toBe(false, 'Expected failed to be false after complete');
    expect(e.succeeded).toBe(true, 'Expected succeeded to be true after complete');
  });

  it('should be completed after the fail method is called', () => {
    const e = new ActionEvent(expectedAction, expectedEvent);
    const err = new Error('Monkey error');
    expect(e.completed).toBe(false, 'Expected completed to be false after create');
    e.fail(err);
    expect(e.completed).toBe(true, 'Expected completed to be true after complete');
    expect(e.failed).toBe(true, 'Expected failed to be true after complete');
    expect(e.succeeded).toBe(false, 'Expected succeeded to be false after complete');
    expect(e.error).toBe(err);
  });

  it('should be stream the completion after the complete method is called', fakeAsync(() => {
    const e = new ActionEvent(expectedAction, expectedEvent);
    let completed = false;
    e.afterComplete().subscribe(() => (completed = true));
    e.complete();
    tick();
    expect(completed).toBe(true);
  }));
});
