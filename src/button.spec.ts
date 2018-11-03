import Button, { ItmButtonRef } from './button';
import { BehaviorSubject } from 'rxjs';
import ActionEmitter from './action_emitter';

describe('ItmButton', () => {
  it('should create with a minimal config', () => {
    expect(Button.factory.serialize({key: 'save'})).toBeTruthy();
  });

  it('should create with a complete config', () => {
    const config = {
      key: 'save',
      icon: 'save_alt',
      disabled: true,
      mode: Button.Mode.icon
    };
    expect(Button.factory.serialize(config)).toBeTruthy();
  });
});

describe('ItmButtonRef', () => {
  it('should create with a minimal config', () => {
    const target = new BehaviorSubject(null);
    const emitter = new ActionEmitter(target);
    const button = Button.factory.serialize({key: 'save'});
    expect(new ItmButtonRef(button, target, emitter)).toBeTruthy();
  });

  it('should create with a complete config', () => {
    const config = {
      key: 'save',
      icon: 'save_alt',
      disabled: true,
      mode: Button.Mode.icon
    };
    const button = Button.factory.serialize(config);
    const target = new BehaviorSubject(null);
    const emitter = new ActionEmitter(target);
    expect(new ItmButtonRef(button, target, emitter)).toBeTruthy();
  });
});
