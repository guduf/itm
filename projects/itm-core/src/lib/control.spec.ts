import Control from './control';

describe('ItmControl', () => {
  it('should create with a minimal config', () => {
    expect(Control.factory.serialize({key: 'save'})).toBeTruthy();
  });

  it('should create with a complete config', () => {
    const config = {
      key: 'test',
      type: Control.Type.number,
      pattern: /foobar/,
      required: true
    };
    expect(Control.factory.serialize(config)).toBeTruthy();
  });
});
