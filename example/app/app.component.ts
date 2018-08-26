import { Component } from '@angular/core';

import { Itms, ItmsSource } from 'src/itm';
import { ItmTableConfig } from 'src/table-config';

@Component({
  selector: 'app-root',
  template: `
    <itm-table [table]="table" [itemsSource]="itemsSource" color="primary"></itm-table>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'itm';

  itemsSource: ItmsSource = [{id: 63}, {id: 64}, {id: 65}];

  table: ItmTableConfig = {
    columns: [
      {
        key: 'id',
        header: (items: Itms) => `${items.length} item${items.length > 1 ? 's' : ''}`
      },
    ],
    canSelect: true,
    selectionLimit: 3,
    setRowClass: () => 'foo'
  };
}
