import { Map, Range, RecordOf } from 'immutable';

import Area from './area';
import Column from './column';
import Control from './control';
import Grid from './grid';
import Field from './field';
import Form from './form';
import Prop from './prop';
import Table from './table';
import RecordFactory from './record-factory';

const ITM_TYPE_META = Symbol('ITM_TYPE_META');

export function ItmType<I extends Object = {}>(cfg: ItmType.Config<I> = {}): ClassDecorator {
  return (target: any) => {
    const props: Map<string, Prop> = Prop.get(target);
    Reflect.set(target, ITM_TYPE_META, ItmType.factory.serialize({target, props}, cfg));
  };
}

export type ItmType<I extends Object = {}> = RecordOf<ItmType.Model<I>>;

export module ItmType {
  export interface Config<I extends Object = {}> {
    target?: any;
    props?: Map<string, Prop>;
    key?: string;
    grid?: Grid.Config<I>;
    form?: Grid.Config<I>;
    table?: Grid.Config<I>;
  }

  export interface Model<I extends Object = {}> extends Config<I> {
    key: string;
    grid: Grid;
    form: Form;
    table: Table;
    target: any;
    props: Map<string, Prop>;
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
          .setIn([Area.factory.selector, prop.key], prop.area)
          .setIn([Field.selector, prop.key], prop.field)
          .setIn([Column.factory.selector, prop.key], prop.column)
          .setIn([Control.selector, prop.key], prop.control)
      ),
      Map<string, Map<string, Area>>()
    );
    const template = props.reduce<string[][]>(
      (templateAcc, {area}) => [
        ...templateAcc,
        Range(0, 4).map(() => area.key).toArray()
      ],
      []
    );
    const tableTemplate =  props.reduce<string[][]>(
      (templateAcc, {area}) => [[
        ...templateAcc[0],
        ...Range(0, 4).map(() => area.key).toArray()
      ]],
      [[]]
    );
    const grid = Grid.factory.serialize({areas, template}, cfg.grid);
    const form = Form.factory.serialize(grid, cfg.form);
    const table = Table.factory.serialize({areas, template: tableTemplate}, cfg.table);
    return {key, target, props, grid, form, table};
  };

  export const factory: RecordFactory<ItmType, Config> = RecordFactory.build({
    selector,
    serializer,
    model: {key: null, target: null, props: null, grid: null, form: null, table: null}
  });

  export function get<I extends Object = {}>(target: any): ItmType<I> {
    return Reflect.get(target, ITM_TYPE_META);
  }
}

export default ItmType;
