import { Injectable, Pipe, PipeTransform, Inject } from '@angular/core';
import { Map } from 'immutable';

import { Itm } from './item';
import Grid from './grid';
import Form from './form';
import Table from './table';
import Type from './type';

@Injectable()
export class ItmTypeService {
  constructor(
    @Inject(Type.RECORD_MAP_TOKEN)
    private readonly _types: Map<string, Type>
  ) { }

  get<I extends Itm = Itm>(key: string): Type<I> {
    if (!this._types.has(key)) throw new ReferenceError(`Missing ItmType with key '${key}'`);
    return this._types.get(key);
  }
}

@Pipe({name: 'itmTypeGrid'})
export class ItmTypeGridPipe implements PipeTransform {
  constructor(
    private _typeService: ItmTypeService
  ) { }

  transform(key: string, cfg?: Grid.Config): Grid {
    const typeGrid = this._typeService.get(key).form;
    return cfg ? Grid.factory.serialize(typeGrid, cfg) : typeGrid;
  }
}

@Pipe({name: 'itmTypeForm'})
export class ItmTypeFormPipe implements PipeTransform {
  constructor(
    private _typeService: ItmTypeService
  ) { }

  transform(key: string, cfg?: Grid.Config): Form {
    const typeForm = this._typeService.get(key).form;
    return cfg ? Form.factory.serialize(typeForm, cfg) : typeForm;
  }
}

@Pipe({name: 'itmTableType'})
export class ItmTableTypePipe implements PipeTransform {
  constructor(
    private _typeService: ItmTypeService
  ) { }

  transform(key: string, cfg?: Table.Config): Table {
    const typedTable = this._typeService.get(key).table;
    return cfg ? Table.factory.serialize(typedTable, cfg) : typedTable;
  }
}
