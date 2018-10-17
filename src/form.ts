import { Map } from 'immutable';

import ActionArea from './action-area';
import Area from './area';
import Control from './control';
import Field from './field';
import Grid from './grid';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export type ItmForm = Grid;

export module ItmForm {
  export const selector = 'form';

  export interface Model<T extends Object = {}> {
    areas: Map<string, Map<string, Area<T>>>;
  }

  export interface Init {
    getNgForm: () => FormGroup;
  }

  const submitActionArea = ActionArea.factory.serialize({
    key: 'submit',
    icon: 'save_alt'
  });

  const serializer = (): Model => {
    const areas = Map<string, Map<string, Area>>().set(
      ActionArea.selector,
      Map<string, Area>().set(submitActionArea.key, submitActionArea)
    );
    return {areas};
  };

  export const factory: Grid.Factory<ItmForm, {}, Init> = Grid.factory.extend({
    selector,
    serializer,
    model: {areas: null},
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
