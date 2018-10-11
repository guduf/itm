import Area from './area';
import Column from './column';
import Control from './control';
import { Itm, ItmPipeLike } from './item';
import { ComponentType } from './utils';
import Field from './field';
import RecordFactory from './record-factory';
import { Map, RecordOf } from 'immutable';

// tslint:disable-next-line:max-line-length
export function ItmProp<I extends Itm = Itm>(cfg: ItmProp.Config<I> = {}): PropertyDecorator {
  return (proto: any, key: string & keyof I) => {
    if (typeof key !== 'string') return;
    let props: Map<keyof I, ItmProp.Record> = Reflect.get(proto, ItmProp.MAP_META);
    if (!props) (props = Map());
    const record = ItmProp.factory.serialize({key}, cfg);
    Reflect.set(proto, ItmProp.MAP_META, props.set(key, record));
  };
}

export module ItmProp {
  export interface Config<I extends Itm = Itm> {
    key?: keyof I & string;
    /**
     * The component displayed in the container.
     * In case of component class, the value is used by the component factory.
     * In case of string, the value is used as the attribute for default cell. */
    cell?: ItmPipeLike<I, string> | ComponentType | false;
    header?: ItmPipeLike<I[], string> | ComponentType | false;
    label?: ItmPipeLike<I, string> | false;

    area?: Partial<Area.Config>;
    column?: Partial<Column.Config>;
    field?: Partial<Field.Config>;
    control?: Partial<Control.Config>;
    type?: Partial<Control.Type>;
  }

  export interface Model<I extends Itm = Itm> extends Config<I> {
    area: Area.Record<I>;
    column: Column.Record<I>;
    field: Field.Record<I>;
    control: Control.Record<I>;
  }

  export type Record<I extends Itm = Itm> = RecordOf<Model<I>>;

  const selector = 'prop';

  const serializer = (cfg: RecordOf<Config>): Model => {
    if (!cfg.key && typeof cfg.key !== 'string') throw new TypeError('Expected key');
    const key = cfg.key;
    const area = Area.factory.serialize({key, text: item => item[key]}, cfg, cfg.area);
    const column = Column.factory.serialize(area, {header: cfg.header}, cfg.column);
    const field = Field.factory.serialize(area, {label: cfg.label}, cfg.field);
    const control = Control.factory.serialize(field, {type: cfg.type}, cfg.control);
    return {key, area, column, control, field};
  };

  export const factory: RecordFactory<Record, Config> = RecordFactory.build({
    selector: selector,
    serializer,
    // tslint:disable-next-line:max-line-length
    model: {key: null, cell: null, control: null, header: null, label: null, area: null, column: null, field: null}
  });

  export const MAP_META = Symbol('ITM_PROPS_META');

  export function get<I extends Itm = Itm>(target: any): Map<string & keyof I, Record<I>> {
    return Reflect.get(target.prototype, MAP_META);
  }
}

export default ItmProp;
