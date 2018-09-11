import { Component } from '@angular/core';

import { ItmTableConfig } from 'src/table-config';
import { Itm } from '../../src/item';
import { ItmActionEvent } from 'src/action';
import { DATA } from './data';
import { ItmCardConfig } from 'src/card';

@Component({
  selector: 'app-root',
  template: `
    <itm-card [card]="'user' | itmCardType:card" [item]="itemsSource[0]"></itm-card>
    <itm-table
      [table]="'user' | itmTableType:table"
      [itemsSource]="itemsSource"
      (event)="onEvent($event)"></itm-table>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'itm';

  itemsSource: Itm[] = DATA;

  card: ItmCardConfig = {
    template: `
      firstName = lastName  =
      ipAddress = =         =
    `
  };

  table: ItmTableConfig = {
    rowActions: [{key: 'delete'}, {key: 'print'}]
  };

  onEvent(e: ItmActionEvent<Itm>) {
    if (e.key === 'delete') this.remove(e.target);
  }

  remove(item: Itm) {
    const i = this.itemsSource.indexOf(item);
    this.itemsSource = [...this.itemsSource.slice(0, i), ...this.itemsSource.slice(i + 1)];
  }
}
