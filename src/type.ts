
import { InjectionToken } from '@angular/core';
import { Map, Range, RecordOf } from 'immutable';

import Area from './area';
import Control from './control';
import Grid from './grid';
import Field from './field';
import Form from './form';
import { Itm } from './item';
import Prop from './prop';
import RecordFactory from './record-factory';
import Table from './table';

const ITM_TYPE_META = Symbol('ITM_TYPE_META');

export function ItmType<I extends Itm = Itm>(cfg: ItmType.Config<I> = {}): ClassDecorator {
  return (target: any) => {
    const props: Map<keyof I & string, Prop> = Prop.get(target);
    Reflect.set(target, ITM_TYPE_META, ItmType.factory.serialize({target, props}, cfg));
  };
}

export type ItmType<I extends Itm = Itm> = RecordOf<ItmType.Model<I>>;

export module ItmType {
  export interface Config<I extends Itm = Itm> {
    target?: any;
    props?: Map<string & keyof I, Prop>;
    key?: string;
    grid?: Grid.Config<I>;
    form?: Grid.Config<I>;
    table?: Table.Config<I>;
  }

  export interface Model<I extends Itm = Itm> extends Config<I> {
    key: string;
    grid: Grid;
    form: Grid;
    table: Table<I>;
    target: any;
    props: Map<string & keyof I, Prop>;
  }

  const selector = 'type';

  const serializer = (cfg: RecordOf<Config>): Model => {
    const target = cfg.target;
    const key = (
      cfg.key && typeof cfg.key === 'string' ? cfg.key : (target.name as string).toLowerCase()
    );
    if (!key) throw new TypeError('Expected key');
    const props: Map<string, Prop> = Map.isMap(cfg.props) ? cfg.props : Map();
    const areas = props.toSet().reduce(
      (acc, prop) => (
        acc
          .setIn([Area.selector, prop.key], prop.area)
          .setIn([Field.selector, prop.key], prop.field)
          .setIn([Control.selector, prop.key], prop.control)
      ),
      Map<string, Map<string, Area>>()
    );
    const template = props.reduce<string[][]>(
      (templateAcc, {area}) => [
        ...templateAcc,
        Range(0, area.size).map(() => area.key).toArray()
      ],
      []
    );
    const grid = Grid.factory.serialize({areas, template}, cfg.grid);
    const form = Form.factory.serialize({areas, template}, cfg.form);
    const columns = props.toSet().map(prop => prop.column);
    const table = Table.factory.serialize({columns}, cfg.table);
    return {key, target, props, grid, form, table};
  };

  export const factory: RecordFactory<ItmType, Config> = RecordFactory.build({
    selector,
    serializer,
    model: {key: null, target: null, props: null, grid: null, form: null, table: null}
  });

  export function get<I extends Itm = Itm>(target: any): ItmType<I> {
    return Reflect.get(target, ITM_TYPE_META);
  }

  export const RECORD_MAP_TOKEN = new InjectionToken<Map<string, ItmType>>('ITM_TYPE_MAP_TOKEN');
}

export default ItmType;
