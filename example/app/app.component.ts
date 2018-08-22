import { Component } from '@angular/core';
import { ItmTable } from 'src/table';
import { Itms } from 'src/itm';
import { of } from 'rxjs';
import { ItmsChanges, Itm } from '../../src/itm';

@Component({
  selector: 'app-root',
  template: `<itm-table [table]="table" [itemsChanges]="itemsChanges"></itm-table>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'itm';

  itemsChanges: ItmsChanges = of([{id: 42}]);

  table: ItmTable = {
    columns: [
      {
        key: 'id',
        cell: ({id}: Itm) => `#${id}`,
        header: (items: Itms) => `${items.length} item${items.length > 1 ? 's' : ''}`
      }
    ]
  };
}
