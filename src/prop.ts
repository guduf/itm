import { ItmArea } from './area';
import { ItmAreaConfig } from './area-config';
import { ItmColumnConfig, ItmColumn } from './column';
import { Itm, ItmPipeLike } from './item';
import { ComponentType } from './utils';
import { ItmFieldConfig, ItmField } from './field';

export interface ItmPropConfig<I extends Itm = Itm> {
  key?: keyof I & string;
  /**
   * The component displayed in the container.
   * In case of component class, the value is used by the component factory.
   * In case of string, the value is used as the attribute for default cell. */
  cell?: ItmPipeLike<I, string> | ComponentType | false;
  header?: ItmPipeLike<I[], string> | ComponentType | false;
  label?: ItmPipeLike<I[], string> | false;

  area?: ItmAreaConfig;
  column?: ItmColumnConfig;
  field?: ItmFieldConfig;
}

export class ItmPropDef<I extends Itm = Itm> implements ItmPropConfig<I> {
  readonly key: string;
  readonly area: ItmArea<I>;
  readonly column: ItmColumnConfig<I>;
  readonly field: ItmFieldConfig<I>;

  constructor(key: string, cfg: ItmPropConfig<I> & Partial<ItmAreaConfig<I>>) {
    if (cfg.key && typeof cfg.key === 'string') (this.key = cfg.key);
    else if (key && typeof key === 'string') (this.key = key);
    // tslint:disable-next-line:max-line-length
    else throw new TypeError('InvalidItmPropConfig: Key must be specified in config if prop key is not a string');
    this.area = new ItmArea(({key, ...(cfg as Partial<ItmAreaConfig<I>>), ...(cfg.area || {})}));
    // tslint:disable-next-line:max-line-length
    this.column = new ItmColumn(({
      ...this.area,
      header: cfg.header || cfg.header !== false && cfg.label,
      ...(cfg.column || {})
    } as ItmColumnConfig));
    this.field = new ItmField(({
      ...this.area,
      label: cfg.label,
      ...(cfg.column || {})
    } as ItmFieldConfig));
  }
}

export const ITM_PROPS_META = Symbol('ITM_PROPS_META');

// tslint:disable-next-line:max-line-length
export function ItmProp<I extends Itm = Itm>(cfg: ItmPropConfig<I> = {}): PropertyDecorator {
  return (proto: any, key: string & keyof I) => {
    if (typeof key !== 'string') return;
    let props: Map<keyof I, ItmPropDef> = Reflect.get(proto, ITM_PROPS_META);
    if (!props) {
      props = new Map();
      Reflect.set(proto, ITM_PROPS_META, props);
    }
    let propDef: ItmPropDef;
    try { propDef = new ItmPropDef<I>(key, cfg); }
    catch (err) {
      console.error(err);
      throw new TypeError(`Failed to create ItmPropDef for key '${String(key)}': ${proto}`);
    }
    props.set(key, propDef);
  };
}
