import { FormGroup } from '@angular/forms';
import { Collection, List } from 'immutable';

import Control from './control';
import Grid from './grid';
import ControlRef from './control_ref';
import Target from './target';

export class ItmFormRef<T extends Object = {}> extends FormGroup {
  controls: { [P in keyof T]: ControlRef };

  constructor(grid: Grid, target: Target<T>) {
    const controls = grid.positions.reduce(
      (acc, position) => {
        if (position.selector !== Control.selector) return acc;
        const control: Control = grid.areas.getIn([Control.selector, position.key]);
        if (!control) throw new ReferenceError('Expected control');
        const controlRef = new ControlRef(control, target.value);
        return {...(acc as {}), [control.key]: controlRef};
      },
      {} as { [P in keyof T]: ControlRef }
    );
    super(controls);
  }

  get(path: Array<string | number> | string): ControlRef | null {
    return super.get(path) as ControlRef;
  }
}

export default ItmFormRef;
