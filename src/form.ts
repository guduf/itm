import { Map, RecordOf } from 'immutable';

import Control from './control';
import Field from './field';
import Grid from './grid';
import { FormGroup } from '@angular/forms';

export type ItmForm = Grid & RecordOf<ItmForm.Model>;

export module ItmForm {
  export const selector = 'form';

  export interface Model {
    formGroup: FormGroup;
  }

  const serializer = (cfg: null, ancestor: Grid): Model => {
    const formGroup = new FormGroup({});
    formGroup.valueChanges.subscribe(e => console.log(e));
    return {formGroup};
  };

  export const factory: Grid.Factory<ItmForm, {}> = Grid.factory.extend({
    selector,
    serializer,
    model: {formGroup: null},
    shared: new Grid.Shared({
      defaultSelector: Control.selector,
      areaFactories: Map({field: Field.factory, control: Control.factory})
    })
  });
}

export default ItmForm;
