import { Map } from 'immutable';

import Area from './area';
import Grid from './grid';

export type ItmForm = Grid;

export module ItmForm {
  export const selector = 'form';

  export interface Model<T extends Object = {}> {
    areas: Map<string, Map<string, Area<T>>>;
  }
}

export default ItmForm;
