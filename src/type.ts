import { Itm } from './item';
import { ItmTableConfig } from './table-config';
import { ItmTableDef } from './table-def';
import { ItmGrid, ItmGridConfig } from './grid';
import { ItmPropDef, ITM_PROPS_META } from './prop';
import { ItmArea } from './area';

export class ItmTypeConfig<I extends Itm = Itm> {
  key?: string;
  grid?: ItmGridConfig;
  table?: ItmTableConfig<I>;
}

export class ItmTypeDef<I extends Itm = Itm> implements ItmTypeConfig {
  readonly key: string;
  readonly grid: ItmGrid;
  readonly table: ItmTableDef<I>;

  constructor(
    readonly type: any,
    private readonly _props: Map<string & keyof I, ItmPropDef> = new Map(),
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
    const gridCfg = cfg.grid && typeof cfg.grid === 'object' ? cfg.grid : {};
    const areasCfg = ItmGrid.parseAreas(gridCfg.areas);
    const areas = new Map<string, Map<string, ItmArea>>();
    const defaultAreas = Array.from(this._props.keys())
      .reduce((keys, key) => keys.set(key, this._props.get(key).area), new Map<string, ItmArea>());
    areas.set('$default', defaultAreas);
    if (areasCfg) areasCfg
      .forEach((keys, areaSelector) => keys.forEach((areaCfg, areaKey) => {
        if (!areas.has(areaSelector)) areas.set(areaSelector, new Map());
        areas.get(areaSelector).set(areaKey, areaCfg);
      }));

    this.grid = new ItmGrid({
      ...gridCfg,
      template: (
        gridCfg.template ? gridCfg.template :
          Array.from(this._props.values()).map(prop => {
            const row: string[] = [];
            for (let i = 0; i < prop.area.size; i++) row.push(prop.key);
            return row;
          })
      ),
      areas
    });
  }

  getProp(key: keyof I & string): ItmPropDef<I> {
    let propDef = this._props.get(key);
    if (propDef) return propDef;
    for (propDef of Array.from(this._props.values()))
      if (propDef.key === key) return propDef;
  }
}

const ITM_TYPE_META = Symbol('ITM_TYPE_META');

export function ItmType<I extends Itm = Itm>(cfg: ItmTypeConfig = {}): ClassDecorator {
  return (type: any) => {
    const props: Map<keyof I & string, ItmPropDef> = Reflect.get(type.prototype, ITM_PROPS_META);
    Reflect.set(type, ITM_TYPE_META, new ItmTypeDef(type, props, cfg));
  };
}

export function getItmTypeDef<I extends Itm = Itm>(type: any): ItmTypeDef<I> {
  return Reflect.get(type, ITM_TYPE_META);
}

export class ItmTypeDefs extends Map<string, ItmTypeDef> { }
