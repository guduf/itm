import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { RecordOf } from 'immutable';

import Control from './control';
import Form from './form';
import GridArea from './grid-area';
import RecordFactory from './record-factory';

export type ItmGridControl = GridArea<Form, Control> & RecordOf<ItmGridControl.Model>;

export module ItmGridControl {
  export interface Model {
    formControl: AbstractControl;
  }

  const serializer = (cfg: null, {area, grid, target}: GridArea<Form, Control>): Model => {
    const formControl = new FormControl(target.value[area.key]);
    if (grid.formGroup instanceof FormGroup) grid.formGroup.setControl(area.key, formControl);
    return {formControl};
  };

  const selector = 'gridControl';

  export const factory: RecordFactory<ItmGridControl> = RecordFactory.build({
    selector,
    serializer,
    model: {formControl: null},
    ancestors: [GridArea.factory as any]
  });
}

export default ItmGridControl;
