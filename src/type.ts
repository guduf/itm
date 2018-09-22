import { Itm } from './item';
import { ItmTableConfig } from './table-config';
import { ItmTableDef } from './table-def';
import { ItmGridDef, ItmGridConfig } from './grid';
import { ItmPropDef, ITM_PROPS_META } from './prop';

export class ItmTypeConfig<I extends Itm = Itm> {
  key?: string;
  card?: ItmGridConfig<I>;
  table?: ItmTableConfig<I>;
}

export class ItmTypeDef<I extends Itm = Itm> implements ItmTypeConfig {
  readonly key: string;
  readonly card: ItmGridDef<I>;
  readonly table: ItmTableDef<I>;

  constructor(
    readonly type: any,
    private readonly _props: Map<keyof I, ItmPropDef> = new Map(),
    cfg: ItmTypeConfig = {}
  ) {
    if (cfg.key && typeof cfg.key === 'string') this.key = cfg.key;
    else if (type.name && typeof type.name === 'string')
      this.key = (type.name as string).toLowerCase();
    else throw new TypeError('InvalidItmTypeConfig : Expected [key] as string for type config');
    const tableCfg = cfg.table && typeof cfg.table === 'object' ? cfg.table : {};
    this.table = new ItmTableDef({
      ...tableCfg,
      columns: [
        ...(Array.from(this._props.values()).map(propDef => propDef.column)),
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
          Array.from(this._props.values()).map(prop => {
            const row: string[] = [];
            for (let i = 0; i < prop.size; i++) row.push(prop.key);
            return row;
          })
      ),
      areas: [
        ...(Array.from(this._props.values()).map(propDef => propDef)),
        ...(
          Array.isArray(cardCfg.areas) ? cardCfg.areas :
          cardCfg.areas instanceof Map ? Array.from(cardCfg.areas.values()) :
            []
        )
      ]
    });
  }

  getProp(key: keyof I | string): ItmPropDef<I> {
    let propDef = this._props.get(key);
    if (propDef) return propDef;
    for (propDef of Array.from(this._props.values()))
      if (propDef.key === key) return propDef;
  }
}

const ITM_TYPE_META = Symbol('ITM_TYPE_META');

export function ItmType<I extends Itm = Itm>(cfg: ItmTypeConfig = {}): ClassDecorator {
  return (type: any) => {
    const props: Map<keyof I, ItmPropDef> = Reflect.get(type, ITM_PROPS_META);
    Reflect.set(type, ITM_TYPE_META, new ItmTypeDef(type, props, cfg));
  };
}

export function getItmTypeDef<I extends Itm = Itm>(type: any): ItmTypeDef<I> {
  return Reflect.get(type, ITM_TYPE_META);
}

export class ItmTypeDefs extends Map<string, ItmTypeDef> { }
