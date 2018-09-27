import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Set } from 'immutable';

import { Itm } from './item';
import { ItmTableDef } from './table-def';
import { ItmTypeDefs, ItmTypeDef } from './type';
import { ItmTableConfig } from './table-config';
import { ItmGridConfig, ItmGrid } from './grid';
import { ItmColumn } from './column';

@Injectable()
export class ItmTypeService {
  constructor(
    private readonly _types: ItmTypeDefs
  ) { }

  get<I extends Itm = Itm>(key: string): ItmTypeDef<I> {
    if (!this._types.has(key))
      throw new ReferenceError(`ItmTypeDefNotFound Expected type with key: ${key}`);
    return this._types.get(key);
  }
}

@Pipe({name: 'itmGridType'})
export class ItmGridTypePipe implements PipeTransform {
  constructor(
    private _typeService: ItmTypeService
  ) { }
  transform(key: string, cfg?: ItmGridConfig): ItmGrid {
    const typedGrid = this._typeService.get(key).grid;
    if (!cfg) return typedGrid;
    const areasCfg = ItmGrid.parseAreas(cfg.areas);
    if (areasCfg) areasCfg
      .forEach((keys, areaSelector) => keys.forEach((areaCfg, areaKey) => {
        if (!typedGrid.areas.has(areaSelector)) typedGrid.areas.set(areaSelector, new Map());
        typedGrid.areas.get(areaSelector).set(areaKey, areaCfg);
      }));
    return new ItmGrid({
      ...(typedGrid as ItmGridConfig),
      ...cfg,
      areas: typedGrid.areas
    });
  }
}


@Pipe({name: 'itmTableType'})
export class ItmTableTypePipe implements PipeTransform {
  constructor(
    private _typeService: ItmTypeService
  ) { }
  transform(key: string, cfg?: ItmTableConfig): ItmTableDef {
    const typeDef = this._typeService.get(key);
    if (!typeDef) {
      console.error(new ReferenceError('Missing type: ' + key));
      return cfg instanceof ItmTableDef ? cfg : new ItmTableDef(cfg);
    }
    if (!cfg) return typeDef.table;
    let def: ItmTableDef = cfg instanceof ItmTableDef ? cfg : new ItmTableDef(cfg);
    def = new ItmTableDef({
      ...(typeDef.table as ItmTableConfig),
      ...cfg,
      columns: Set<ItmColumn>().concat(def.columns, typeDef.table.columns)
    });
    return def;
  }
}
