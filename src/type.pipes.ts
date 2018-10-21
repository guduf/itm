import { Pipe, PipeTransform } from '@angular/core';

import Config from './config';
import Grid from './grid';
import Form from './form';
import { ComponentType } from './utils';

@Pipe({name: 'itmTypeGrid'})
export class ItmTypeGridPipe implements PipeTransform {
  constructor(
    private _config: Config
  ) { }

  transform(key: string, cfg?: Grid.Config): Grid {
    const type = this._config.types.get(key);
    if (!type) throw new ReferenceError(`Missing type with key: '${key}'`);
    return cfg ? Form.factory.serialize(type.grid, cfg) : type.grid;
  }
}

@Pipe({name: 'itmTypeForm'})
export class ItmTypeFormPipe implements PipeTransform {
  constructor(
    private _config: Config
  ) { }

  transform(key: string, cfg?: Grid.Config): Form {
    const type = this._config.types.get(key);
    if (!type) throw new ReferenceError(`Missing type with key: '${key}'`);
    return cfg ? Form.factory.serialize(type.form, cfg) : type.form;
  }
}

export const ITM_TYPE_PIPES: ComponentType[] = [ItmTypeGridPipe, ItmTypeFormPipe];

export default ITM_TYPE_PIPES;
