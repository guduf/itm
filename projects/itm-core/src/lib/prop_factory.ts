
import AreaFactory from './area_factory';
import ColumnFactory from './column_factory';
import ControlFactory from './control_factory';
import FieldFactory from './field_factory';
import Prop from './prop';
import RecordFactory from './record_factory';

export function ItmPropFactory(): RecordFactory<Prop, Prop.Config>;
export function ItmPropFactory(...cfgs: Partial<Prop.Config>[]): Prop;
// tslint:disable-next-line:max-line-length
export function ItmPropFactory(...cfgs: Partial<Prop.Config>[]): Prop | RecordFactory<Prop, Prop.Config> {
  if (!cfgs.length) return ItmPropFactory._static;
  return ItmPropFactory._static.serialize(...cfgs);
}

export module ItmPropFactory {
  export function normalize(cfg: Prop.Config): Prop.Model {
    if (!cfg.key && typeof cfg.key !== 'string') throw new TypeError('Expected key');
    const key = cfg.key;
    const area = AreaFactory({key}, cfg, cfg.area);
    const field = FieldFactory(area, {label: cfg.label}, cfg.field);
    const column = ColumnFactory(field, {header: field.label}, cfg.column);
    const control = ControlFactory(field, cfg.control);
    return {key, area, column, control, field};
  }

  export const _static: RecordFactory<Prop, Prop.Config> = RecordFactory.build({
    selector: Prop.selector,
    normalize,
    // tslint:disable-next-line:max-line-length
    model: {key: null, comp: null, column: null, control: null, header: null, label: null, area: null, field: null}
  });
}

export default ItmPropFactory;
