import { Map, RecordOf } from 'immutable';

import Control from './control';
import Field from './field';
import Grid from './grid';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export type ItmForm = Grid;

export module ItmForm {
  export const selector = 'form';

  export interface Init {
    getNgForm: () => FormGroup;
  }

  export const factory: Grid.Factory<ItmForm, {}, Init> = Grid.factory.extend({
    selector,
    shared: new Grid.Shared<Grid, Init>({
      defaultSelector: Control.selector,
      areaFactories: Map({field: Field.factory, control: Control.factory}),
      onInit: (record: Grid, target: BehaviorSubject<Object>) => {
        const ngControls = record.positions.reduce(
          (acc, position) => {
            if (position.selector === Control.selector) (
              acc[position.key] = new FormControl(target.value[position.key])
            );
            return acc;
          },
          {} as { [key: string]: AbstractControl }
        );
        const formGroup = new FormGroup(ngControls);
        formGroup.valueChanges.subscribe(e => console.log(e));
        return {getNgForm: () => formGroup};
      }
    })
  });
}

export default ItmForm;
