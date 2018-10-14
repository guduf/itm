import { AbstractControl, FormControl } from '@angular/forms';
import { RecordOf } from 'immutable';

import Control from './control';
import GridArea from './grid-area';
import RecordFactory from './record-factory';

export type ItmGridControl = GridArea<Control> & RecordOf<ItmGridControl.Model>;

export module ItmGridControl {
  export interface Model {
    formControl: AbstractControl;
  }

  const serializer = (cfg: null, ancestor: GridArea<Control>): Model => {
    const formControl = new FormControl(ancestor.target.value[ancestor.area.key]);
    return {formControl};
  };

  const selector = 'gridControl';

  export const factory: RecordFactory<ItmGridControl> = RecordFactory.build({
    selector,
    serializer,
    model: {formControl: null},
    ancestors: [GridArea.factory as GridArea.Factory<Control>]
  });
}

export default ItmGridControl;
