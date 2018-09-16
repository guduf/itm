import { Itm, ItmPipe, ItmPipeLike, deferPipe } from './item';
import { ItmTableConfig } from './table-config';
import { ItmColumnDef, ItmColumnConfig } from './column';
import { ItmTableDef } from './table-def';
import { ItmAreaConfig } from './area-config';
import { ItmGridDef, ItmGridConfig } from './grid';

export interface ItmPropConfig<I extends Itm = Itm> {
  key: string;
  computed?: boolean;
  label?: ItmPipeLike<I, string>;
  maxLength?: number;
  pattern?: RegExp;
  required?: boolean;
  size?: number;
  text?: ItmPipeLike<I, string>;
  column?: ItmColumnConfig<I>;
}

export class ItmPropDef<I extends Itm = Itm> implements ItmPropConfig<I> {
  readonly key: string;
  readonly computed: boolean;
  readonly label: ItmPipe<I, string>;
  readonly maxLength: number;
  readonly pattern: RegExp;
  readonly required: boolean;
  readonly size: number;
  readonly text: ItmPipe<I, string>;
  readonly card: ItmGridDef<I>;
  readonly column: ItmColumnDef<I>;

  constructor(cfg: ItmPropConfig<I> & ItmAreaConfig<I>) {
    if (cfg.key && typeof cfg.key === 'string') this.key = cfg.key;
    else throw new TypeError('InvalidItmPropConfig : Expected [key] as string for prop config');
    this.computed = cfg.computed || false;
    this.size = cfg.size >= 0 ? Math.round(cfg.size) : 2;
    this.pattern = cfg.pattern instanceof RegExp ? cfg.pattern : null;
    this.maxLength = cfg.maxLength > 0 ? Math.round(cfg.maxLength) : -1;
    this.required = typeof cfg.required === 'boolean' ? cfg.required : false;
    this.label = deferPipe(cfg.label || this.key);
    this.text = deferPipe(cfg.label || ((item: I) => item[this.key]));
    this.column = new ItmColumnDef({
      key: this.key,
      ...(cfg.column && typeof cfg.column === 'object' ? cfg.column : {}),
      ...(cfg as ItmColumnConfig<I>)
    });
  }

  createColumnDef(): ItmColumnDef {
    return new ItmColumnDef({
      key: String(this.key),
      size: this.size
    });
  }
}

const ITM_ATTRS_META = Symbol('ITM_ATTRS_META');

// tslint:disable-next-line:max-line-length
export function ItmProp<I extends Itm = Itm>(cfg: Partial<ItmPropConfig<I>> = {}): PropertyDecorator {
  return (proto: any, key: (string | symbol) & keyof I) => {
    let props: Map<keyof I, ItmPropDef> = Reflect.get(proto, ITM_ATTRS_META);
    if (!props) {
      props = new Map();
      Reflect.set(proto, ITM_ATTRS_META, props);
    }
    props.set(key, new ItmPropDef<I>({key: cfg.key || String(key), ...cfg}));
  };
}

export class ItmTypeConfig<I extends Itm = Itm> {
  key?: string;
  card?: ItmGridConfig<I>;
  table?: ItmTableConfig<I>;
}

export class ItmTypeDef<I extends Itm = Itm> implements ItmTypeConfig {
  readonly key: string;
  readonly card: ItmGridDef<I>;
  readonly table: ItmTableDef<I>;

  constructor(readonly type: any, cfg: ItmTypeConfig, readonly props: Map<keyof I, ItmPropDef>) {
    if (cfg.key && typeof cfg.key === 'string') this.key = cfg.key;
    else if (type.name && typeof type.name === 'string')
      this.key = (type.name as string).toLowerCase();
    else throw new TypeError('InvalidItmTypeConfig : Expected [key] as string for type config');
    const tableCfg = cfg.table && typeof cfg.table === 'object' ? cfg.table : {};
    this.table = new ItmTableDef({
      ...tableCfg,
      columns: [
        ...(Array.from(this.props.values()).map(propDef => propDef.column)),
        ...(
          Array.isArray(tableCfg.columns) ? tableCfg.columns :
          tableCfg.columns instanceof Map ? Array.from(tableCfg.columns.values()) :
          []
        )
      ]
    });
    const cardCfg = cfg.card && typeof cfg.card === 'object' ? cfg.card : {};
    this.card = new ItmGridDef({
      ...cardCfg,
      template: (
        cardCfg.template ? cardCfg.template :
          Array.from(this.props.values()).map(prop => {
            const row: string[] = [];
            const size = (prop.card || {size: 0}).size || prop.size;
            for (let i = 0; i < size; i++) row.push(prop.key);
            return row;
          })
      ),
      areas: [
        ...(Array.from(this.props.values()).map(propDef => propDef)),
        ...(
          Array.isArray(cardCfg.areas) ? cardCfg.areas :
          cardCfg.areas instanceof Map ? Array.from(cardCfg.areas.values()) :
            []
        )
      ]
    });
  }
}

const ITM_TYPE_META = Symbol('ITM_TYPE_META');

export function ItmType<I extends Itm = Itm>(config: ItmTypeConfig = {}): ClassDecorator {
  return (type: any) => {
    const props: Map<keyof I, ItmPropDef> = Reflect.get(type.prototype, ITM_ATTRS_META);
    Reflect.set(type, ITM_TYPE_META, new ItmTypeDef(type, config, props));
  };
}

export function getItmTypeDef<I extends Itm = Itm>(type: any): ItmTypeDef<I> {
  return Reflect.get(type, ITM_TYPE_META);
}

export class ItmTypeDefs extends Map<string, ItmTypeDef> { }
