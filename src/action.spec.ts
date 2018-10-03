// tslint:disable:max-line-length
import { fakeAsync, tick } from '@angular/core/testing';

import Action from './action';
import { fromStringPipe } from './item';

describe('ItmAction', () => {
  it('should create with a valid minimal config', () => {
    const config = {key: 'create'} as Action.Config;
    expect(Action.factory.serialize(config)).toBeTruthy();
  });

  it('should throw a type error when a invalid config', () => {
    const config = {} as Action.Config;
    expect(() => Action.factory.serialize(config)).toThrowError(/key/);
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
