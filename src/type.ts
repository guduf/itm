import { Itm } from './item';
import Table from './table';
import Grid from './grid';
import { ItmPropDef, ITM_PROPS_META } from './prop';
import Area from './area';
import { Map, RecordOf } from 'immutable';
import RecordFactory from './record-factory';
import { InjectionToken } from '@angular/core';

const ITM_TYPE_META = Symbol('ITM_TYPE_META');

export function ItmType<I extends Itm = Itm>(cfg: ItmType.Config<I> = {}): ClassDecorator {
  return (target: any) => {
    const props: Map<keyof I & string, ItmPropDef> = Reflect.get(target.prototype, ITM_PROPS_META);
    Reflect.set(target, ITM_TYPE_META, ItmType.factory.serialize({target, props, ...cfg}));
  };
}

export module ItmType {
  export interface Config<I extends Itm = Itm> {
    key?: string;
    grid?: Grid.Config<I>;
    table?: Table.Config<I>;
    target?: any;
    props?: Map<string & keyof I, ItmPropDef>;
  }

  export interface Model<I extends Itm = Itm> extends Config<I> {
    key: string;
    grid: Grid.Record<I>;
    table: Table.Record<I>;
    target: any;
    props: Map<string & keyof I, ItmPropDef>;
  }

  export type Record<I extends Itm = Itm> = RecordOf<Model<I>>;

  const selector = 'type';

  const serializer = (cfg: RecordOf<Config>): Model => {
    const target = cfg.target;
    const key = (
      cfg.key && typeof cfg.key === 'string' ? cfg.key : (target.name as string).toLowerCase()
    );
    if (!key) throw new TypeError('Expected key');
    const props = cfg.props;
    const areas = Map<string, Map<string, Area.Record>>().set('$default', props.toSet().reduce(
      (acc, prop) => acc.set(prop.key, prop.area),
      Map<string, Area.Record>()
    ));
    const grid = Grid.factory.serialize(cfg.grid, {areas});
    const columns = props.toSet().map(prop => prop.column);
    const table = Table.factory.serialize(cfg.table, {columns});
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

  export const MAP_TOKEN = new InjectionToken('MAP_TOKEN');
}

export default ItmType;
