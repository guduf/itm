import { Component, Inject } from '@angular/core';
import { of } from 'rxjs';
import { distinctUntilKeyChanged, map, mergeMap } from 'rxjs/operators';

import { ItmJsonRegistrer, ItmTableFactory } from '../../itm';
import { JSON_PLAYGROUND_VIEW_DATA, JsonPlaygroundViewData } from './json_playground.component';
import { TableJsonPlaygroundFiles } from './table_playground';

@Component({
  selector: 'itm-demo-table-playground-view',
  template: `
    <itm-table *ngIf="table | async as table"
      [table]="table" [target]="targets | async"></itm-table>
  `
})
export class TablePlaygroundViewComponent {
  readonly table = this._view.files.pipe(
    distinctUntilKeyChanged('table'),
    mergeMap(({table}) => (
      table ? this._jsonRegistrer.buildGrid(table, ItmTableFactory()) : of(null))
    )
  );

  readonly targets = this._view.files.pipe(
    distinctUntilKeyChanged('targets'),
    map(({targets}) => targets || []),
  );

  constructor(
    private _jsonRegistrer: ItmJsonRegistrer,
    @Inject(JSON_PLAYGROUND_VIEW_DATA)
    private _view: JsonPlaygroundViewData<TableJsonPlaygroundFiles>
  ) { }
}
