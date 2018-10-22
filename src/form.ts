import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { Map } from 'immutable';

import Area from './area';
import Button from './button';
import Control, { NgForm } from './control';
import Field from './field';
import Grid from './grid';
import Target from './target';

export type ItmForm = Grid;

export module ItmForm {
  export const selector = 'form';

  export interface Model<T extends Object = {}> {
    areas: Map<string, Map<string, Area<T>>>;
  }

  export interface Init {
    getNgForm: () => FormGroup;
  }

  const ngFormProvider: Area.Provider = {
    deps: [Grid, Target],
    useFactory: (grid: Grid, target: Target): NgForm => {
      const ngControls = grid.positions.reduce(
        (acc, position) => {
          if (position.selector === Control.selector) (
            acc[position.key] = new FormControl(target.value[position.key])
          );
          return acc;
        },
        {} as { [key: string]: AbstractControl }
      );
      return new FormGroup(ngControls);
    }
  };

  const submitButton = Button.factory.serialize({
    key: 'submit',
    icon: 'save_alt',
    mode: Button.Mode.icon
  });

  const serializer = (): Model => {
    const areas = Map<string, Map<string, Area>>().set(
      Button.factory.selector,
      Map<string, Area>().set(submitButton.key, submitButton)
    );
    return {areas};
  };

  export const factory: Grid.Factory<ItmForm, {}> = Grid.factory.extend({
    selector,
    serializer,
    model: {areas: null},
    shared: new Grid.Shared({
      defaultSelector: Control.selector,
      areaFactories: Map({field: Field.factory, control: Control.factory}),
      providers: Map<any, Area.Provider>().set(NgForm, ngFormProvider)
    })
  });
}

export default ItmForm;
