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
  activatedEditor: 'grid' | 'target' = 'grid';
  grid: ItmGrid.Config;
  target: Object;
  gridErrors: ErrorObject[];
  targetErrors: ErrorObject[];
  sidenavMode = 'side';
  sidenavOpened = true;
  activeModel = 'simple';

  gridModel = {schema: 'grid', content: {areas: [{key: 'id'}], template: 'id'}};
  targetModel = {schema: 'target', content: {id: 63}};
  links = [{label: 'Simple grid', model: 'simple'}];

  constructor(
    private _jsonRegistrer: ItmJsonRegistrer
  ) { }

  handleGridChange(e: EditorModel) {
    this.grid = null;
    console.log(e);
    if (e.valid) this._jsonRegistrer.buildGrid(e.value).then(
      grid => (this.grid = grid),
      err => console.error(err)
    );
    this.gridErrors = e.valid ? null : (e as InvalidEditorModel).errors;
  }

  handleTargetChange(e: EditorModel) {
    this.target = e.valid ? e.value : null;
    this.targetErrors = e.valid ? null : (e as InvalidEditorModel).errors;
  }
}
