import { Map } from 'immutable';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import Action from './action';
import Area from './area';
import Button from './button';
import ButtonAreaFactory from './button_area_factory';
import ControlFactory from './control_factory';
import FieldFactory from './field_factory';
import Form from './form';
import FormRef from './form_ref';
import Grid from './grid';
import GridFactory from './grid_factory';
import Target from './target';

export function ItmFormFactory(): GridFactory<Form, {}>;
export function ItmFormFactory(...cfgs: Partial<Grid.Config>[]): Form;
export function ItmFormFactory(...cfgs: Partial<Grid.Config>[]): Form | GridFactory<Form, {}> {
  if (!cfgs.length) return ItmFormFactory._static;
  return ItmFormFactory._static.serialize(...cfgs);
}

export module ItmFormFactory {
  const submitButton = ButtonAreaFactory({
    key: 'submit',
    action: '$formSubmit',
    icon: 'save_alt',
    mode: Button.Mode.icon
  });

  export function provideResolvers(formRef: FormRef): Observable<Action.Resolvers> {
    return formRef.statusChanges.pipe(
      startWith(formRef.status),
      map(() => (
        (Map() as Action.Resolvers)
          .set(submitButton.action, formRef.valid ? () => formRef.value : null)
      ))
    );
  }

  export const gridShared = new GridFactory.Shared({
    defaultSelector: ControlFactory().selector,
    areaFactories: Map({field: FieldFactory(), control: ControlFactory()}),
    providers: Map<any, Area.Provider>().set(FormRef, {deps: [Grid, Target], useClass: FormRef}),
    resolversProvider: {deps: [FormRef], useFactory: provideResolvers}
  });


  export function normalize(): Form.Model {
    const areas = Map<string, Map<string, Area>>().set(
      Button.selector,
      Map<string, Area>().set(submitButton.key, submitButton)
    );
    return {areas};
  }

  export const _static: GridFactory<Form, {}> = GridFactory().extend({
    selector: 'form',
    normalize,
    model: {areas: null},
    shared: ItmFormFactory.gridShared
  });
}

export default ItmFormFactory;
