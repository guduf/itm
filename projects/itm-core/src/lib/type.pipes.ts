import { Inject, Pipe, PipeTransform } from '@angular/core';

import Grid from './grid';
import Form from './form';
import FormFactory from './form_factory';
import Table from './table';
import TableFactory from './table_factory';
import Registrer, { ITM_REGISTRER } from './registrer';

@Pipe({name: 'itmTypeGrid'})
export class ItmTypeGridPipe implements PipeTransform {
  constructor(
    @Inject(ITM_REGISTRER)
    private _rgstr: Registrer
  ) { }

  transform(key: string, cfg?: Grid.Config): Grid {
    const type = this._rgstr.types.get(key);
    if (!type) throw new ReferenceError(`Missing type with key: '${key}'`);
    return cfg ? FormFactory(type.grid, cfg) : type.grid;
  }
}

@Pipe({name: 'itmTypeForm'})
export class ItmTypeFormPipe implements PipeTransform {
  constructor(
    @Inject(ITM_REGISTRER)
    private _rgstr: Registrer
  ) { }

  transform(key: string, cfg?: Grid.Config): Form {
    const type = this._rgstr.types.get(key);
    if (!type) throw new ReferenceError(`Missing type with key: '${key}'`);
    return cfg ? FormFactory(type.form, cfg) : type.form;
  }
}

@Pipe({name: 'itmTypeTable'})
export class ItmTypeTablePipe implements PipeTransform {
  constructor(
    @Inject(ITM_REGISTRER)
    private _rgstr: Registrer
  ) { }

  transform(key: string, cfg?: Grid.Config): Table {
    const type = this._rgstr.types.get(key);
    if (!type) throw new ReferenceError(`Missing type with key: '${key}'`);
    return cfg ? TableFactory(type.table, cfg) : type.table;
  }
}

export const ITM_TYPE_PIPES: any[] = [
  ItmTypeGridPipe,
  ItmTypeFormPipe,
  ItmTypeTablePipe
];

export default ITM_TYPE_PIPES;
