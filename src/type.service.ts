import { Injectable, Pipe, PipeTransform, Inject } from '@angular/core';
import { Map } from 'immutable';

import { Itm } from './item';
import Card from './card';
import Table from './table';
import Type from './type';
import Grid from './grid';

@Injectable()
export class ItmTypeService {
  constructor(
    @Inject(Type.MAP_TOKEN)
    private readonly _types: Map<string, Type.Record>
  ) { }

  get<I extends Itm = Itm>(key: string): Type.Record<I> {
    if (!this._types.has(key)) throw new ReferenceError(`Missing ItmType with key '${key}'`);
    return this._types.get(key);
  }
}

@Pipe({name: 'itmCardType'})
export class ItmCardTypePipe implements PipeTransform {
  constructor(
    private _typeService: ItmTypeService
  ) { }
  transform(key: string, cfg?: Card.Config): Card.Record {
    const typedCard = this._typeService.get(key).card;
    return cfg ? Card.factory.serialize(typedCard, cfg) : typedCard;
  }
}

@Pipe({name: 'itmGridType'})
export class ItmGridTypePipe implements PipeTransform {
  constructor(
    private _typeService: ItmTypeService
  ) { }
  transform(key: string, cfg?: Grid.Config): Grid.Record {
    const typedGrid = this._typeService.get(key).grid;
    return cfg ? Grid.factory.serialize(typedGrid, cfg) : typedGrid;
  }
}

@Pipe({name: 'itmTableType'})
export class ItmTableTypePipe implements PipeTransform {
  constructor(
    private _typeService: ItmTypeService
  ) { }
  transform(key: string, cfg?: Table.Config): Table.Record {
    const typedTable = this._typeService.get(key).table;
    return cfg ? Table.factory.serialize(typedTable, cfg) : typedTable;
  }
}
