import Action from './action';

describe('ItmAction', () => {
  const rawAction = {key: 'foo', nativeEvent: {}, target: {}};
  let action: Action.Unresolved;

  it('should create a unresolved action', () => {
    action = new Action.Unresolved(rawAction);
    expect(action instanceof Action.Generic).toBeTruthy('Expected instance of generic action');
    expect(action.key).toBe(rawAction.key);
    expect(action.nativeEvent).toBe(rawAction.nativeEvent);
    expect(action.target).toBe(rawAction.target);
    expect(action.resolved).toBe(false);
    expect(action.failed).toBe(false);
  });

  it('should create a resolved action', () => {
    const result = {};
    const resolved = new Action.Resolved(action, result);
    expect(resolved.key).toBe(rawAction.key);
    expect(resolved.nativeEvent).toBe(rawAction.nativeEvent);
    expect(resolved.target).toBe(rawAction.target);
    expect(resolved.resolved).toBe(true);
    expect(resolved.failed).toBe(false);
    expect(resolved.result).toBe(result);
  });

  it('should create a failed action', () => {
    const err = new Error();
    const resolved = new Action.Failed(action, err);
    expect(resolved.key).toBe(rawAction.key);
    expect(resolved.nativeEvent).toBe(rawAction.nativeEvent);
    expect(resolved.target).toBe(rawAction.target);
    expect(resolved.resolved).toBe(true);
    expect(resolved.failed).toBe(true);
    expect(resolved.error).toBe(err);
  });
});
