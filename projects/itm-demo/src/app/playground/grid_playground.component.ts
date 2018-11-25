import { ItmGrid, ItmJsonRegistrer } from '../../../../itm-core/src/public_api';

import { Component } from '@angular/core';

import { EditorModel, InvalidEditorModel } from './editor.service';
import { ErrorObject } from 'ajv';

@Component({
  selector: 'itm-demo-grid-playground',
  templateUrl: 'grid_playground.component.html',
  styleUrls: ['grid_playground.component.scss']
})

export class GridPlaygroundComponent {
  grid: ItmGrid.Config;
  target = {id: 63};
  ajvErrors: ErrorObject[];

  constructor(
    private _jsonRegistrer: ItmJsonRegistrer
  ) { }

  handleEditorChange(e: EditorModel) {
    this.grid = null;
    if (e.valid) this._jsonRegistrer.buildGrid(e.value).then(
      grid => (this.grid = grid),
      err => console.error(err)
    );
    this.ajvErrors = e.valid ? null : (e as InvalidEditorModel).errors;
    console.log(e.valid, this);
  }
}
