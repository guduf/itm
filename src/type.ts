
import { InjectionToken } from '@angular/core';
import { Map, Range, RecordOf } from 'immutable';

import Area from './area';
import Control from './control';
import Field from './field';
import TypeGrid from './type-grid';
import { Itm } from './item';
import Prop from './prop';
import RecordFactory from './record-factory';
import Table from './table';

const ITM_TYPE_META = Symbol('ITM_TYPE_META');

export function ItmType<I extends Itm = Itm>(cfg: ItmType.Config<I> = {}): ClassDecorator {
  return (target: any) => {
    const props: Map<keyof I & string, Prop.Record> = Prop.get(target);
    Reflect.set(target, ITM_TYPE_META, ItmType.factory.serialize({target, props}, cfg));
  };
}

export module ItmType {
  export interface Config<I extends Itm = Itm> {
    target?: any;
    props?: Map<string & keyof I, Prop.Record>;
    key?: string;
    grid?: TypeGrid.Config<I>;
    table?: Table.Config<I>;
  }

  export interface Model<I extends Itm = Itm> extends Config<I> {
    key: string;
    grid: TypeGrid.Record<I>;
    table: Table.Record<I>;
    target: any;
    props: Map<string & keyof I, Prop.Record>;
  }

  export type Record<I extends Itm = Itm> = RecordOf<Model<I>>;

  const selector = 'type';

  const serializer = (cfg: RecordOf<Config>): Model => {
    const target = cfg.target;
    const key = (
      cfg.key && typeof cfg.key === 'string' ? cfg.key : (target.name as string).toLowerCase()
    );
    if (!key) throw new TypeError('Expected key');
    const props: Map<string, Prop.Record> = Map.isMap(cfg.props) ? cfg.props : Map();
    const areasMap = props.toSet().reduce(
        (acc, prop) => ({
          areas: acc.areas.setIn([Area.selector, prop.key], prop.area),
          fields: acc.fields.set(prop.key, prop.field),
          controls: acc.controls.set(prop.key, prop.control)
        }),
        {
          areas: Map<string, Map<string, Area.Record>>().set(Area.selector, Map()),
          fields: Map<string, Field.Record>(),
          controls: Map<string, Control.Record>()
        }
      );
    const template = props.reduce<string[][]>(
      (templateAcc, {area}) => [
        ...templateAcc,
        Range(0, area.size).map(() => area.key).toArray()
      ],
      []
    );
    const grid = TypeGrid.factory.serialize({template, ...areasMap}, cfg.grid);
    const columns = props.toSet().map(prop => prop.column);
    const table = Table.factory.serialize(grid, {columns}, cfg.table);
    return {key, target, props, grid, table};
  };

  export const factory: RecordFactory<Record, Config> = RecordFactory.build({
    selector,
    serializer,
    model: {key: null, target: null, props: null, grid: null, table: null}
  });

  export function get<I extends Itm = Itm>(target: any): Record<I> {
    return Reflect.get(target, ITM_TYPE_META);
  }

  export const RECORD_MAP_TOKEN = new InjectionToken<Map<string, Record>>('ITM_TYPE_MAP_TOKEN');
}

export default ItmType;
