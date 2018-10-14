import { Map } from 'immutable';

import Control from './control';
import Field from './control';
import Grid from './grid';

export module ItmForm {
  export const selector = 'form';

  export const factory: Grid.Factory = Grid.factory.extend({
    selector,
    shared: new Grid.Shared({
      defaultSelector: Control.selector,
      areaFactories: Map({field: Field.factory, control: Control.factory})
    })
  });
}

export default ItmForm;
