import { List, Map } from 'immutable';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import Action from './action';
import Area from './area';
import Button from './button';
import Control, { ItmFormRef } from './control';
import Field from './field';
import Grid from './grid';
import Target from './target';

export type ItmForm = Grid;

export module ItmForm {
  export const selector = 'form';

  export interface Model<T extends Object = {}> {
    areas: Map<string, Map<string, Area<T>>>;
  }

  export function provideFormRef(grid: Grid, target: Target): ItmFormRef {
    const controls = grid.positions.reduce(
      (acc, position) => {
        if (position.selector !== Control.selector) return acc;
        const control: Control = grid.areas.getIn([Control.selector, position.key]);
        if (!control) throw new ReferenceError('Expected control');
        return acc.push(control);
      },
      List<Control>()
    );
    return new ItmFormRef(controls, target.value);
  }

  const resolversProvider: Grid.ResolversProvider = {
    deps: [ItmFormRef],
    useFactory: (ngForm: ItmFormRef): Observable<Action.Resolvers> => {
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
      providers: Map<any, Area.Provider>().set(ItmFormRef, {
        deps: [Grid, Target],
        useFactory: provideFormRef
      }),
      resolversProvider
    })
  });
}

export default ItmForm;
