import Button, { ItmButtonRef } from './button';
import { BehaviorSubject } from 'rxjs';
import ActionEmitter from './action_emitter';
import ButtonAreaFactory from './button_area_factory';

describe('ItmButton', () => {
  it('should create with a minimal config', () => {
    expect(ButtonAreaFactory({key: 'save'})).toBeTruthy();
  });

  it('should create with a complete config', () => {
    const config = {
      key: 'save',
      icon: 'save_alt',
      disabled: true,
      mode: Button.Mode.icon
    };
    expect(ButtonAreaFactory(config)).toBeTruthy();
  });
});

describe('ItmButtonRef', () => {
  it('should create with a minimal config', () => {
    const target = new BehaviorSubject(null);
    const emitter = new ActionEmitter(target);
    const button = ButtonAreaFactory({key: 'save'});
    expect(new ItmButtonRef(button, target, emitter)).toBeTruthy();
  });

  it('should create with a complete config', () => {
    const config = {
      key: 'save',
      icon: 'save_alt',
      disabled: true,
      mode: Button.Mode.icon
    };
    const button = ButtonAreaFactory(config);
    const target = new BehaviorSubject(null);
    const emitter = new ActionEmitter(target);
    expect(new ItmButtonRef(button, target, emitter)).toBeTruthy();
  });
});
