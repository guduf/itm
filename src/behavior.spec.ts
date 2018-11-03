import { BehaviorSubject } from 'rxjs';
import Behavior from './behavior';
import { WithBehaviors } from './behavior';
import { SimpleChanges } from '@angular/core';

describe('ItmBehavior', () => {
  describe('StaticBehavior', () => {
    it('should get expected value', () => {
      const path = 'foo';
      const expected = {[path]: {}};
      const behavior = new Behavior.StaticBehavior(new BehaviorSubject(expected), path);
      let value: any;
      const subscr = behavior.subscribe(e => (value = e));
      expect(behavior.value).toBe(expected[path]);
      expect(behavior.value).toBe(value);
      subscr.unsubscribe();
    });
    it('should replay the initial behavior value.', () => {
      const path = 'foo';
      const subject = new BehaviorSubject({[path]: {}});
      const behavior = new Behavior.StaticBehavior(subject, path);
      const expected = {[path]: {}};
      subject.next(expected);
      let value: any;
      const subscr = behavior.subscribe(e => (value = e));
      expect(value).toBe(expected[path]);
      subscr.unsubscribe();
    });
  });

  describe('create()', () => {
    it('should return the same behavior when no path', () => {
      const parent = new BehaviorSubject({});
      expect(Behavior.create(parent)).toBe(parent);
    });

    it('should throw error whith invalid parent', () => {
      expect(() => Behavior.create([] as any)).toThrowError(/parent/);
    });

    it('should create StaticBehavior with path', () => {
      // tslint:disable-next-line:max-line-length
      expect(Behavior.create(new BehaviorSubject({}), 'foo') instanceof Behavior.StaticBehavior).toBeTruthy('Expected ItmStaticBehavior');
    });
  });
});

describe('WithBehaviors', () => {
  class WithBehaviorsTestImpl extends WithBehaviors {
    constructor(init) { super(init); }
  }

  it('should create with minimal arguments', () => {
    const impl = new WithBehaviorsTestImpl({});
    expect(impl).toBeTruthy();
    impl.ngOnDestroy();
  });

  it('should create with init keys', () => {
    const impl = new WithBehaviorsTestImpl({foo: null});
    expect(impl).toBeTruthy();
    impl.ngOnDestroy();
  });

  it('should updates the value', () => {
    const expectedKey = 'foo';
    const init = {[expectedKey]: {}};
    const impl = new WithBehaviorsTestImpl(init);
    const expected = 'bar';
    const changes: SimpleChanges = {
      // tslint:disable-next-line:max-line-length
      [expectedKey]: {previousValue: init[expectedKey], currentValue: expected, isFirstChange: () => true, firstChange: true}
    };
    impl.ngOnChanges(changes);
    expect(impl.behaviors[expectedKey].value).toBe(expected);
    impl.ngOnDestroy();
  });
});
