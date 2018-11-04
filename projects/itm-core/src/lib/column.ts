import { RecordOf } from 'immutable';

import Area from './area';
import Target from './target';

export type ItmColumn<T extends Object = {}> = Area<T> & RecordOf<ItmColumn.Model<T>>;

export module ItmColumn {
  interface ModelConfig<T extends Object = {}> {
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

  const serializer = (cfg: ModelConfig, ancestor: Area): Model => {
    if (!Area.factory.isFactoryRecord(ancestor)) throw new TypeError('Expected area record');
    const header: Area = (
      Area.factory.isFactoryRecord(cfg.header) ? cfg.header as Area :
        Area.factory.serialize(ancestor, (
          typeof cfg.header === 'function' ? {text: cfg.header} :
          cfg.header && typeof cfg.header === 'object' ? cfg.header :
            {text: ancestor.key}
        ))
    );
    return {header, sortable: cfg.sortable === true};
  };

  const selector = 'column';

  export type Config<T extends Object = {}> = Area.Config<T> & ModelConfig<T>;

  export const factory: Area.Factory<ItmColumn, Config> = Area.factory.extend({
    selector,
    serializer,
    model: {header: null, sortable: null},
    shared: new Area.Shared({
      defaultText: ({area, target}) => target[area.key]
    })
  });
}

export default ItmColumn;
