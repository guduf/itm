import { Component } from '@angular/core';

import { ItmTableConfig } from 'src/table-config';
import { ItmColumnConfig } from '../../src/column-config';
import { Itm } from '../../src/item';
import { ItmActionEvent } from 'src/action';
import { DATA } from './data';

const ID_COLUMN: ItmColumnConfig = {
  key: 'id',
  header: (items: Itm[]) => `${items.length} item${items.length > 1 ? 's' : ''}`
};

@Component({
  selector: 'app-root',
  template: `
  <ul itmDroppable #droppableList="itmDroppable">
    <li  *ngFor="let value of values" itmDraggable>
        {{value}}
    </li>
    <li *itmDropPlaceholderFor="droppableList">
        PLACEHOLDER
    </li>
  </ul>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'itm';

  itemsSource: Itm[] = DATA;

  values = DATA.map(name => name.lastName);

  table: ItmTableConfig = {
    actions: [{key: 'delete'}, {key: 'print'}],
    columns: [ID_COLUMN, 'firstName', 'lastName'],
    canSelect: true,
    selectionLimit: 3,
    setRowClass: () => 'foo'
  };

  onEvent(e: ItmActionEvent<Itm>) {
    if (e.key === 'delete') this.remove(e.target);
  }

  remove(item: Itm) {
    const i = this.itemsSource.indexOf(item);
    this.itemsSource = [...this.itemsSource.slice(0, i), ...this.itemsSource.slice(i + 1)];
  }
}
