import { RecordOf } from 'immutable';

import Area from './area';
import Column from './column';
import Control from './control';
import { ComponentType } from './utils';
import Field from './field';
import Target from './target';

export type ItmProp<T extends Object = {}> = RecordOf<ItmProp.Model<T>>;

export module ItmProp {
  export interface Config<T extends Object = {}> {
    key?: string;
    /**
     * The component displayed in the container.
     * In case of component class, the value is used by the component factory.
     * In case of string, the value is used as the attribute for default cell. */
    comp?: ComponentType | false;
    header?: Target.PipeLike<T[], string> | ComponentType | false;
    label?: Target.PipeLike<T, string> | false;

    area?: Partial<Area.Config>;
    column?: Partial<Column.Config>;
    control?: Partial<Control.Config>;
    field?: Partial<Field.Config>;
    type?: Control.Type;
  }

  export interface Model<T extends Object = {}> extends Config<T> {
    area: Area<T>;
    field: Field<T>;
    column: Column<T>;
    control: Control<T>;
  }

  export const selector = 'prop';
}

export default ItmProp;
