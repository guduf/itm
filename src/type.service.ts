import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Itm } from './item';
import { ItmTableDef } from './table-def';
import { ItmTypeDefs, ItmTypeDef } from './type';
import { ItmTableConfig } from './table-config';
import { ItmCardConfig, ItmCardDef } from './card';

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

@Pipe({name: 'itmCardType'})
export class ItmCardTypePipe implements PipeTransform {
  constructor(
    private _typeService: ItmTypeService
  ) { }
  transform(key: string, cfg?: ItmCardConfig): ItmCardDef {
    const typeCardDef = this._typeService.get(key).card;
    if (!cfg) return typeCardDef;
    return new ItmCardDef({
      ...typeCardDef,
      ...cfg,
      areas: [
        ...Array.from(typeCardDef.areas.values()),
        ...(cfg.areas ? Array.from(cfg.areas.values()) : [])
      ],
      size: cfg.size ? cfg.size : cfg.template ? null : typeCardDef.size
    });
  }
}


@Pipe({name: 'itmTableType'})
export class ItmTableTypePipe implements PipeTransform {
  constructor(
    private _typeService: ItmTypeService
  ) { }
  transform(key: string, cfg: ItmTableConfig = {}): ItmTableDef {
    let def: ItmTableDef = cfg instanceof ItmTableDef ? cfg : new ItmTableDef(cfg);
    const typeTableDef = this._typeService.get(key).table;
    def = new ItmTableDef({
      ...(typeTableDef),
      ...cfg,
      columns: [
        ...Array.from(typeTableDef.columns.values()),
        ...Array.from(def.columns.values())
      ]
    });
    return def;
  }
}
