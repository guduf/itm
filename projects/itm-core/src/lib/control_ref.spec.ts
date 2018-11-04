import Control from './control';
import ControlRef from './control_ref';

describe('ItmControlRef', () => {
  const control = Control.factory.serialize({key: 'name'});

  it('should create with minimal arguments', () => {
    expect(new ControlRef(control, '')).toBeTruthy();
  });
});
