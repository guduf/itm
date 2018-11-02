import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { Map } from 'immutable';

import Action from './action';
import Area from './area';
import Button from './button';
import Control, { NgForm } from './control';
import Field from './field';
import Grid from './grid';
import Target from './target';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type ItmForm = Grid;

export module ItmForm {
  export const selector = 'form';

  export interface Model<T extends Object = {}> {
    areas: Map<string, Map<string, Area<T>>>;
  }

  const ngFormProvider: Area.Provider = {
    deps: [Grid, Target],
    useFactory: (grid: Grid, target: Target): NgForm => {
      const init = target.value;
      const ngControls = grid.positions.reduce(
        (acc, position) => {
          if (position.selector === Control.selector) (
            acc[position.key] = new FormControl(init ? init[position.key] : undefined)
          );
          return acc;
        },
        {} as { [key: string]: AbstractControl }
      );
      return new FormGroup(ngControls);
    }
  };

  const resolversProvider: Grid.ResolversProvider = {
    deps: [NgForm],
    useFactory: (ngForm: NgForm): Observable<Action.Resolvers> => {
      return ngForm.statusChanges.pipe(
        map(() => (
          (Map() as Action.Resolvers).set('submit', ngForm.invalid ? null : () => ngForm.value)
        ))
      );
    }
  };

  const submitButton = Button.areaFactory.serialize({
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
      providers: Map<any, Area.Provider>().set(NgForm, ngFormProvider),
      resolversProvider
    })
  });
}

export default ItmForm;
