import { Component } from '@angular/core';

import Table from 'src/table';
import { Itm } from 'src/item';
import ActionEvent from 'src/action-event';
import { DATA } from './data';
import Grid from 'src/grid';
import { User } from './user';

const tableTemplate  = `
  <itm-table
  [table]="'user' | itmTableType:table"
  [itemsSource]="itemsSource"
  (event)="onEvent($event)"></itm-table>
  `;
@Component({
  selector: 'app-root',
  template: `
    <itm-grid [grid]="'user' | itmTypeGrid:grid" [source]="target"></itm-grid>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'itm';

  itemsSource: Itm[] = DATA;

  table: Table.Config = {
    rowActions: [{key: 'delete'}, {key: 'print'}],
    canSelect: true
  };

  grid: Grid.Config = {
    template: `
      field:id        . gender
      firstName = lastName  =
      email     =
      control:ipAddress =
    `
  };

  target = DATA[0];

  onEvent(e: ActionEvent<Itm>) {
    if (e.key === 'delete') this.remove(e.target);
  }

  remove(item: Itm) {
    const i = this.itemsSource.indexOf(item);
    this.itemsSource = [...this.itemsSource.slice(0, i), ...this.itemsSource.slice(i + 1)];
  }
}
