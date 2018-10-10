
import { InjectionToken } from '@angular/core';
import { Map, Range, RecordOf } from 'immutable';

import Area from './area';
import Card from './card';
import Field from './field';
import Grid from './grid';
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
    grid?: Grid.Config<I>;
    card?: Card.Config<I>;
    table?: Table.Config<I>;
  }

  export interface Model<I extends Itm = Itm> extends Config<I> {
    key: string;
    grid: Grid.Record<I>;
    table: Table.Record<I>;
    card: Card.Record<I>;
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
    const areas = Map<string, Map<string, Area.Record>>()
      .set(Area.selector, props.toSet().reduce(
        (acc, prop) => acc.set(prop.key, prop.area),
        Map<string, Area.Record>()
      ));
    const template = props.reduce<string[][]>(
      (templateAcc, {area}) => [
        ...templateAcc,
        Range(0, area.size).map(() => area.key).toArray()
      ],
      []
    );
    const grid = Grid.factory.serialize({template, areas}, cfg.grid);
    const columns = props.toSet().map(prop => prop.column);
    const table = Table.factory.serialize(grid, {columns}, cfg.table);
    const fields = props.reduce<Map<string, Field.Config>>(
      (acc, prop) => acc.set(prop.key, prop.field),
      Map()
    );
    const card = Card.factory.serialize(grid, cfg.card, {fields});
    return {key, card, target, props, grid, table};
  };

  export const factory: RecordFactory<Record, Config> = RecordFactory.build({
    selector,
    serializer,
    model: {key: null, card: null, target: null, props: null, grid: null, table: null}
  });

  export function get<I extends Itm = Itm>(target: any): Record<I> {
    return Reflect.get(target, ITM_TYPE_META);
  }

  export const MAP_TOKEN = new InjectionToken('MAP_TOKEN');
}

export default ItmType;
