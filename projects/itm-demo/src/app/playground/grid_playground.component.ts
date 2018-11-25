import { ItmGrid } from '../../../../itm-core/src/public_api';

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
  errors: ErrorObject[];

  constructor() { }

  handleEditorChange(e: EditorModel) {
    this.grid = e.valid ? e.value : null;
    this.errors = e.valid ? null : (e as InvalidEditorModel).errors;
  }
}
