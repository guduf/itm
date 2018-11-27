import { ItmGrid, ItmJsonRegistrer } from '../../../../itm-core/src/public_api';

import { Component } from '@angular/core';
import { ErrorObject } from 'ajv';


import { EditorModel, InvalidEditorModel } from './editor.service';
import { GRID_PLAYGROUNDS } from './grid_playground';
import { JsonEditorModel } from './json_editor.component';

@Component({
  selector: 'itm-demo-grid-playground',
  templateUrl: 'grid_playground.component.html',
  styleUrls: ['grid_playground.component.scss']
})

export class GridPlaygroundComponent {
  activatedEditor: 'grid' | 'target' = 'grid';

  grid: ItmGrid.Config = null;

  target: Object = null;

  gridErrors: ErrorObject[] = null;

  targetErrors: ErrorObject[] = null;

  sidenavMode = 'side';

  sidenavOpened = true;

  activePlaygroundId = 'simple';

  readonly playgroundIds = Object.keys(GRID_PLAYGROUNDS);

  readonly playgrounds = GRID_PLAYGROUNDS;

  constructor(
    private _jsonRegistrer: ItmJsonRegistrer
  ) { }

  getActivePlaygroundModel(schema: 'grid' | 'target'): JsonEditorModel {
    return {schema, content: this.playgrounds[this.activePlaygroundId][schema]};
  }

  getPlaygroundLabel(playgroundId: string): string {
    return this.playgrounds[playgroundId].label;
  }

  handleGridChange(e: EditorModel) {
    this.grid = null;
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
