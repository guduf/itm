import { Component, Inject } from '@angular/core';
import { of } from 'rxjs';

import { JSON_PLAYGROUND_VIEW_DATA, JsonPlaygroundViewData } from './json_playground.component';
import { distinctUntilKeyChanged, map, mergeMap } from 'rxjs/operators';

import { ItmGrid, ItmJsonRegistrer } from '../../itm';

@Component({
  selector: 'itm-demo-grid-playground-view',
  template: `
    <itm-grid *ngIf="grid | async as grid" [grid]="grid" [target]="target | async"></itm-grid>
  `
})
export class GridPlaygroundViewComponent {
  readonly grid = this._view.files.pipe(
    distinctUntilKeyChanged('grid'),
    mergeMap(({grid}) => grid ? this._jsonRegistrer.buildGrid(grid) : of(null)),
  );

  readonly target = this._view.files.pipe(
    distinctUntilKeyChanged('target'),
    map(({target}) => target || {}),
  );

  constructor(
    private _jsonRegistrer: ItmJsonRegistrer,
    @Inject(JSON_PLAYGROUND_VIEW_DATA)
    private _view: JsonPlaygroundViewData<{ grid: ItmGrid.Config, target: {} }>
  ) { }
}
