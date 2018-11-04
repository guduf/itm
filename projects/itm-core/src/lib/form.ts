import { Map } from 'immutable';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import Action from './action';
import Area from './area';
import Button from './button';
import Control from './control';
import Field from './field';
import FormRef from './form_ref';
import Grid from './grid';
import Target from './target';

export type ItmForm = Grid;

export module ItmForm {
  export const selector = 'form';

  export interface Model<T extends Object = {}> {
    areas: Map<string, Map<string, Area<T>>>;
  }

  const resolversProvider: Grid.ResolversProvider = {
    deps: [FormRef],
    useFactory: (ngForm: FormRef): Observable<Action.Resolvers> => {
      return ngForm.statusChanges.pipe(
        startWith(ngForm.status),
        map(() => (
          (Map() as Action.Resolvers)
            .set(submitButton.action, ngForm.valid ? () => ngForm.value : null)
        ))
      );
    }
  };

  const submitButton = Button.areaFactory.serialize({
    key: 'submit',
    action: '$formSubmit',
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
      providers: Map<any, Area.Provider>().set(FormRef, {deps: [Grid, Target], useClass: FormRef}),
      resolversProvider
    })
  });
}

export default ItmForm;
