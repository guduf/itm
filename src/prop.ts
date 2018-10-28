import { Map, RecordOf } from 'immutable';

import Area from './area';
import Column from './column';
import Control from './control';
import { ComponentType } from './utils';
import Field from './field';
import RecordFactory from './record-factory';
import Target from './target';

// tslint:disable-next-line:max-line-length
export function ItmProp<T extends Object = {}>(cfg: ItmProp.Config<T> = {}): PropertyDecorator {
  return (proto: any, key: string) => {
    if (typeof key !== 'string') return;
    let props: Map<string, ItmProp> = Reflect.get(proto, ItmProp.MAP_META);
    if (!props) (props = Map());
    const record = ItmProp.factory.serialize({key}, cfg);
    Reflect.set(proto, ItmProp.MAP_META, props.set(key, record));
  };
}

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

  const selector = 'prop';

  const serializer = (cfg: RecordOf<Config>): Model => {
    if (!cfg.key && typeof cfg.key !== 'string') throw new TypeError('Expected key');
    const key = cfg.key;
    const area = Area.factory.serialize({key}, cfg, cfg.area);
    const field = Field.factory.serialize(area, {label: cfg.label}, cfg.field);
    const column = Column.factory.serialize(field, {header: field.label}, cfg.column);
    const control = Control.factory.serialize(field, {type: cfg.type}, cfg.control);
    return {key, area, column, control, field};
  };

  export const factory: RecordFactory<ItmProp, Config> = RecordFactory.build({
    selector: selector,
    serializer,
    // tslint:disable-next-line:max-line-length
    model: {key: null, comp: null, column: null, control: null, header: null, label: null, area: null, field: null}
  });

  export const MAP_META = Symbol('ITM_PROPS_META');

  export function get<T extends Object = {}>(target: any): Map<string, ItmProp<T>> {
    return Reflect.get(target.prototype, MAP_META);
  }
}

export default ItmProp;
