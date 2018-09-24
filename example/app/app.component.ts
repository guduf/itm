import { Component } from '@angular/core';

import { ItmTableConfig } from 'src/table-config';
import { Itm } from '../../src/item';
import { ItmActionEvent } from 'src/action';
import { DATA } from './data';
import { ItmGridConfig } from '../../src/grid';

const tableTemplate  = `
  <itm-table
  [table]="'user' | itmTableType:table"
  [itemsSource]="itemsSource"
  (event)="onEvent($event)"></itm-table>
`;
@Component({
  selector: 'app-root',
  template: `
    <itm-grid [grid]="grid" [target]="target"></itm-grid>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'itm';

  itemsSource: Itm[] = DATA;

  card: ItmGridConfig = {
    template: `
      firstName = lastName  =
      ipAddress = =         =
    `
  };

  table: ItmTableConfig = {
    rowActions: [{key: 'delete'}, {key: 'print'}]
  };

  grid: ItmGridConfig = {
    areas: ['firstName', 'lastName', 'ipAddress'],
    template: `
      firstName = lastName  =
      ipAddress = =         =
    `
  };

  target = DATA[0];

  onEvent(e: ItmActionEvent<Itm>) {
    if (e.key === 'delete') this.remove(e.target);
  }

  remove(item: Itm) {
    const i = this.itemsSource.indexOf(item);
    this.itemsSource = [...this.itemsSource.slice(0, i), ...this.itemsSource.slice(i + 1)];
  }
}
