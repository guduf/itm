import { Component, Inject } from '@angular/core';
import { Observable, empty } from 'rxjs';

import { ITM_DEMO_JSON_PLAYGROUND_MODELS } from './json_playground.component';
import { distinctUntilKeyChanged, map, mergeMap } from 'rxjs/operators';
import ItmJsonRegistrer from '../../../../itm-core/src/lib/json_registrer';

@Component({
  selector: 'itm-demo-grid-playground-view',
  template: `
    <itm-grid *ngIf="grid | async as grid" [grid]="grid" [target]="target | async"></itm-grid>
  `
})
export class GridPlaygroundViewComponent {
  readonly grid = this._models.pipe(
    distinctUntilKeyChanged('grid'),
    mergeMap(({grid}) => grid ? this._jsonRegistrer.buildGrid(grid) : empty()),
  );

  readonly target = this._models.pipe(
    distinctUntilKeyChanged('target'),
    map(({target}) => target || {}),
  );

  constructor(
    private _jsonRegistrer: ItmJsonRegistrer,
    @Inject(ITM_DEMO_JSON_PLAYGROUND_MODELS)
    private _models: Observable<{ [key: string]: Object }>
  ) { }
}
