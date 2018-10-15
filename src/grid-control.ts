import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { RecordOf } from 'immutable';

import Control from './control';
import Form from './form';
import GridArea from './grid-area';
import RecordFactory from './record-factory';

export type ItmGridControl = GridArea<Form, Control> & RecordOf<ItmGridControl.Model>;

export module ItmGridControl {
  export interface Model {
    ngControl: AbstractControl;
  }

  // tslint:disable-next-line:max-line-length
  const serializer = (cfg: null, {area, init, target}: GridArea<Form, Control, any, Form.Init>): Model => {
    const ngControl = (
      init.getNgForm ? init.getNgForm().get(area.key) :
        new FormControl(target.value[area.key])
    );
    return {ngControl};
  };

  const selector = 'gridControl';

  export const factory: RecordFactory<ItmGridControl> = RecordFactory.build({
    selector,
    serializer,
    model: {ngControl: null},
    ancestors: [GridArea.factory as any]
  });
}

export default ItmGridControl;
