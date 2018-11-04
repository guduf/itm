import { BehaviorSubject } from 'rxjs';

import Control from './control';
import FormRef from './form_ref';
import Grid from './grid';

describe('ItmFormRef', () => {
  const control = Control.factory.serialize({key: 'name'});
  const grid = Grid.factory.serialize({template: 'control:name', areas: {control: [control]}});

  it('should create with minimal arguments', () => {
    const expectedKey = 'name';
    const expected = {[expectedKey]: 'foo'};
    const formRef = new FormRef(grid, new BehaviorSubject(expected));
    expect(formRef.get(expectedKey).value).toBe(expected[expectedKey]);
  });
});
