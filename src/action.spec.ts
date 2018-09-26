// tslint:disable:max-line-length
import { fakeAsync, tick } from '@angular/core/testing';

import { ItmActionConfig, ItmAction, ItmActionEvent } from './action';

describe('ItmAction', () => {
  it('should create with a valid minimal config', () => {
    const config = {key: 'create'} as ItmActionConfig;
    expect(new ItmAction(config)).toBeTruthy();
  });

  it('should throw a type error when a invalid config', () => {
    const config = {} as ItmActionConfig;
    expect(() => new ItmAction(config)).toThrowError(/InvalidItmActionConfig/);
  });

  it('should implements a valid config', fakeAsync(() => {
    const expectedIcon = 'power_settings_new';
    const expectedText = 'Activate device';
    const config: ItmActionConfig = {
      key: 'activate',
      icon: expectedIcon,
      text: expectedText
    };
    const def = new ItmAction(config);
    let renderedIcon: string;
    def.icon({}).subscribe(value => renderedIcon = value);
    let renderedText: string;
    def.text({}).subscribe(value => renderedText = value);
    tick();
    expect(renderedIcon).toBe(expectedIcon);
    expect(renderedText).toBe(expectedText);
  }));

  it('should have no icon or text with a valid config', () => {
    const def = new ItmAction({key: 'create', icon: false, text: false});
    expect(def.icon).toBeNull();
    expect(def.text).toBeNull();
  });
});

describe('ItmActionEvent', () => {
  const expectedAction = new ItmAction({key: 'create'});
  const expectedEvent = {} as Event;
  const expectedTarget = {};

  it('should create with a valid minimal config', () => {
    const e = new ItmActionEvent(expectedAction, expectedEvent, expectedTarget);
    expect(e.action).toBe(expectedAction);
    expect(e.nativeEvent).toBe(expectedEvent);
    expect(e.target).toBe(expectedTarget);
  });

  it('should throw type error with invalid config', () => {
    expect(() => new ItmActionEvent({} as ItmAction, expectedEvent)).toThrowError(TypeError);
    expect(() => new ItmActionEvent(expectedAction, null)).toThrowError(TypeError);
  });

  it('should be completed after the complete method is called', () => {
    const e = new ItmActionEvent(expectedAction, expectedEvent);
    expect(e.completed).toBe(false, 'Expected completed to be false after create');
    e.complete();
    expect(e.completed).toBe(true, 'Expected completed to be true after complete');
    expect(e.failed).toBe(false, 'Expected failed to be false after complete');
    expect(e.succeeded).toBe(true, 'Expected succeeded to be true after complete');
  });

  it('should be completed after the fail method is called', () => {
    const e = new ItmActionEvent(expectedAction, expectedEvent);
    const err = new Error('Monkey error');
    expect(e.completed).toBe(false, 'Expected completed to be false after create');
    e.fail(err);
    expect(e.completed).toBe(true, 'Expected completed to be true after complete');
    expect(e.failed).toBe(true, 'Expected failed to be true after complete');
    expect(e.succeeded).toBe(false, 'Expected succeeded to be false after complete');
    expect(e.error).toBe(err);
  });

  it('should be stream the completion after the complete method is called', fakeAsync(() => {
    const e = new ItmActionEvent(expectedAction, expectedEvent);
    let completed = false;
    e.afterComplete().subscribe(() => (completed = true));
    e.complete();
    tick();
    expect(completed).toBe(true);
  }));
});
