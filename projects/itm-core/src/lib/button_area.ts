import { RecordOf } from 'immutable';

import Area from './area';
import Button from './button';

export type ItmButtonArea<T = {}> = Area<T> & RecordOf<Button.Model<T>>;

export module ItmButtonArea {
  export type Config<T extends Object = {}> = Area.Config<T> & Button.Config<T>;
}

export default ItmButtonArea;
