import ControlFactory from './control_factory';
import ControlRef from './control_ref';

describe('ItmControlRef', () => {
  const control = ControlFactory({key: 'name'});

  it('should create with minimal arguments', () => {
    expect(new ControlRef(control, '')).toBeTruthy();
  });
});
