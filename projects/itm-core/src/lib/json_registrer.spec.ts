import JsonRegistrer from './json_registrer';

describe('ItmJsonRegistrer', () => {
  describe('parsePipeInput', () => {
    it('should parse a lambda input', () => {
      const input = '(t) => { return t.name; }';
      expect(JsonRegistrer.parsePipeInput(input)).toBe(input);
    });
    it('should parse a expresion', () => {
      const input = 'target.rank + 1';
      const expected = 'target => (' + input + ')';
      expect(JsonRegistrer.parsePipeInput(input)).toBe(expected);
    });
    it('should parse a template string', () => {
      const input = '`$.firstName $.lastName`';
      const expected = 'target => (`${target.firstName} ${target.lastName}`)';
      expect(JsonRegistrer.parsePipeInput(input)).toBe(expected);
    });
  });
});
