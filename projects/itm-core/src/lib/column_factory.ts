import Area from './area';
import AreaFactory from './area_factory';
import Column from './column';

export function ItmColumnFactory(): AreaFactory<Column, Column.Config>;
export function ItmColumnFactory(...cfgs: Partial<Column.Config>[]): Column;
// tslint:disable-next-line:max-line-length
export function ItmColumnFactory(...cfgs: Partial<Column.Config>[]): Column | AreaFactory<Column, Column.Config> {
  if (!cfgs.length) return ItmColumnFactory._static;
  return ItmColumnFactory._static.serialize(...cfgs);
}

export module ItmColumnFactory {
  const shared = new AreaFactory.Shared({
    defaultText: ({area, target}) => target[area.key]
  });


  export function normalize(cfg: Column.ModelConfig, ancestor: Area): Column.Model {
    if (!AreaFactory().isFactoryRecord(ancestor)) throw new TypeError('Expected area record');
    const header: Area = (
      AreaFactory().isFactoryRecord(cfg.header) ? cfg.header as Area :
        AreaFactory(ancestor, (
          typeof cfg.header === 'function' ? {text: cfg.header} :
          cfg.header && typeof cfg.header === 'object' ? cfg.header :
            {text: ancestor.key}
        ))
    );
    return {header, sortable: cfg.sortable === true};
  }

  export const _static: AreaFactory<Column, Column.Config> = AreaFactory().extend({
    selector: Column.selector,
    normalize,
    model: {header: null, sortable: null},
    shared
  });
}

export default ItmColumnFactory;
