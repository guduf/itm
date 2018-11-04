import { BehaviorSubject } from 'rxjs';

import ControlFactory from './control_factory';
import FormRef from './form_ref';
import GridFactory from './grid_factory';

describe('ItmFormRef', () => {
  const control = ControlFactory({key: 'name'});
  const grid = GridFactory({template: 'control:name', areas: {control: [control]}});

  it('should create with minimal arguments', () => {
    const expectedKey = 'name';
    const expected = {[expectedKey]: 'foo'};
    const formRef = new FormRef(grid, new BehaviorSubject(expected));
    expect(formRef.get(expectedKey).value).toBe(expected[expectedKey]);
  });
});
