import { Map, Range } from 'immutable';

import Area from './area';
import Column from './column';
import ControlFactory from './control_factory';
import GridFactory from './grid_factory';
import Field from './field';
import FormFactory from './form_factory';
import Prop from './prop';
import TableFactory from './table_factory';
import Type from './type';
import RecordFactory from './record_factory';

export function ItmTypeFactory(): RecordFactory<Type, Type.Config>;
export function ItmTypeFactory(...cfgs: Partial<Type.Config>[]): Type;
// tslint:disable-next-line:max-line-length
export function ItmTypeFactory(...cfgs: Partial<Type.Config>[]): Type | RecordFactory<Type, Type.Config> {
  if (!cfgs.length) return ItmTypeFactory._static;
  return ItmTypeFactory._static.serialize(...cfgs);
}
export module ItmTypeFactory {
  export function normalize(cfg: Type.Config): Type.Model {
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
          .setIn([Column.selector, prop.key], prop.column)
          .setIn([ControlFactory().selector, prop.key], prop.control)
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
    const grid = GridFactory({areas, template}, cfg.grid);
    const form = FormFactory(grid, cfg.form);
    const table = TableFactory({areas, template: tableTemplate}, cfg.table);
    return {key, target, props, grid, form, table};
  }

  export const _static: RecordFactory<Type, Type.Config> = RecordFactory.build({
    selector: Type.selector,
    normalize,
    model: {key: null, target: null, props: null, grid: null, form: null, table: null}
  });
}

export default ItmTypeFactory;
