import { Injectable, Pipe, PipeTransform, Inject } from '@angular/core';
import { Map } from 'immutable';

import { Itm } from './item';
import Grid from './grid';
import TypeGrid from './type-grid';
import Table from './table';
import Type from './type';

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

@Pipe({name: 'itmTypeGrid'})
export class ItmTypeGridPipe implements PipeTransform {
  constructor(
    private _typeService: ItmTypeService
  ) { }

  transform(key: string, cfg?: Grid.Config): TypeGrid.Record {
    const typeGrid = this._typeService.get(key).grid;
    return cfg ? TypeGrid.factory.serialize(typeGrid, cfg) : typeGrid;
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
