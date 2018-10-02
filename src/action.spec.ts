// tslint:disable:max-line-length
import { fakeAsync, tick } from '@angular/core/testing';

import Action from './action';
import ActionEvent from './action-event';
import { fromStringPipe } from './item';

describe('ItmAction', () => {
  it('should create with a valid minimal config', () => {
    const config = {key: 'create'} as Action.Config;
    expect(Action.factory.serialize(config)).toBeTruthy();
  });

  it('should throw a type error when a invalid config', () => {
    const config = {} as Action.Config;
    expect(() => Action.factory.serialize(config)).toThrowError(/InvalidItmActionConfig/);
  });

  it('should implements a valid config', fakeAsync(() => {
    const expectedIcon = 'power_settings_new';
    const expectedText = 'Activate device';
    const config: Action.Config = {
      key: 'activate',
      icon: expectedIcon,
      text: expectedText
    };
    const def = Action.factory.serialize(config);
    let renderedIcon: string;
    fromStringPipe(def.icon, {}).subscribe(value => renderedIcon = value);
    let renderedText: string;
    fromStringPipe(def.text, {}).subscribe(value => renderedText = value);
    tick();
    expect(renderedIcon).toBe(expectedIcon);
    expect(renderedText).toBe(expectedText);
  }));

  it('should have no icon or text with a valid config', () => {
    const def = Action.factory.serialize({key: 'create', icon: false, text: false});
    expect(def.icon).toBeNull();
    expect(def.text).toBeNull();
  });
});

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
