import { checkType } from './utils';

describe('checkType()', () => {
  it ('should return true with valid args', () => {
    expect(checkType('string', 'foo')).toBeTruthy('Expected true with string');
    expect(checkType('number', 2)).toBeTruthy('Expected true with number');
    expect(checkType('boolean', false)).toBeTruthy('Expected true with boolean');
    expect(checkType('function', () => {})).toBeTruthy('Expected true with function');
    expect(checkType(['a', 'b', 'c'], 'c')).toBeTruthy('Expected true with array');
    expect(checkType({a: 1, b: 2}, 2)).toBeTruthy('Expected true with object');
    expect(checkType(Date, new Date())).toBeTruthy('Expected true with class');
  });
});
