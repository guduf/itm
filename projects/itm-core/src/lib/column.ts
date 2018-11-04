import { RecordOf } from 'immutable';

import Area from './area';
import Target from './target';

export type ItmColumn<T extends Object = {}> = Area<T> & RecordOf<ItmColumn.Model<T>>;

export module ItmColumn {
  export interface ModelConfig<T extends Object = {}> {
    /** Whether column is sortable. */
    sortable?: boolean;

    /**
     * The component displayed in the header.
     * In case of component class, the value is used by the component factory.
     * In case of string, the value is used as the attribute for default header cell.
     * In case of false, none header is displayed. */
    header?: Target.PipeLike<T[], string> | Area.Config<T[]>;
  }

  export interface Model<T extends Object = {}> extends ModelConfig<T> {
    sortable: boolean;
    header: Area<T[]>;
  }

  export type Config<T extends Object = {}> = Area.Config<T> & ModelConfig<T>;

  export const selector = 'column';
}

export default ItmColumn;
