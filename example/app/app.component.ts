import { Component } from '@angular/core';
import { ItmTableConfig } from 'src/table-config';
import { Itms } from 'src/itm';
import { of } from 'rxjs';
import { ItmsChanges, Itm } from '../../src/itm';

@Component({
  selector: 'app-root',
  template: `
    <itm-table [table]="table" [itemsChanges]="itemsChanges"></itm-table>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'itm';

  itemsChanges: ItmsChanges = of([{id: 42}]);

  table: ItmTableConfig = {
    columns: [
      {
        key: 'id',
        cell: ({id}: Itm) => `#${id}`,
        header: (items: Itms) => `${items.length} item${items.length > 1 ? 's' : ''}`
      }
    ],
    canSelect: true,
    setRowClass: () => 'foo'
  };
}
