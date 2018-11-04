
import { RecordOf } from 'immutable';
import { Observable } from 'rxjs';

import Area from './area';
import Target from './target';

export abstract class ItmFieldLabel extends Observable<string> { }

export type ItmField<T extends Object = {}> = Area<T> & RecordOf<ItmField.Model<T>>;

export module ItmField {
  export interface ModelConfig<T extends Object = {}> {
    label?: Target.PipeLike<T, string> | false;
  }

  export interface Model<T extends Object = {}> extends ModelConfig<T> {
    label: Target.Pipe<T, string> | null;
  }

  export const selector = 'field';

  export type Config<T extends Object = {}> = Area.Config<T> & ModelConfig<T>;
}

export default ItmField;
