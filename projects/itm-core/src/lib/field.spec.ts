import Field from './field';

describe('ItmField', () => {
  it('should create with a minimal config', () => {
    expect(Field.factory.serialize({key: 'test'})).toBeTruthy();
  });

  it('should create with a complete config', () => {
    const config = {
      key: 'test',
      label: () => 'id'
    };
    expect(Field.factory.serialize(config)).toBeTruthy();
  });
});
