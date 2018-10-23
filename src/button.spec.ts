import Button, { ItmButtonRef } from './button';
import { BehaviorSubject } from 'rxjs';

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
    const button = Button.factory.serialize({key: 'save'});
    expect(new ItmButtonRef(button, new BehaviorSubject(null))).toBeTruthy();
  });

  it('should create with a complete config', () => {
    const config = {
      key: 'save',
      icon: 'save_alt',
      disabled: true,
      mode: Button.Mode.icon
    };
    const button = Button.factory.serialize(config);
    expect(new ItmButtonRef(button, new BehaviorSubject({id: 63}))).toBeTruthy();
  });
});
