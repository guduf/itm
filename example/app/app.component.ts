import { Component } from '@angular/core';
import { ItmGrid } from 'itm-core';

import { DATA } from './data';
import { User } from './user';

@Component({
  selector: 'app-root',
  template: `
    <itm-form
      [form]="'user' | itmTypeForm:grid"
      [target]="data[0]"></itm-form>
    <itm-table
      [table]="'user' | itmTypeTable"
      [target]="[data[0]]"
      (action)="handleTableAction($event)"></itm-table>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data = DATA as User[];

  grid: ItmGrid.Config = {
    template: `
      field:id          . gender    =
      firstName         = lastName  =
      email             = =
      control:ipAddress = .         button:submit
    `
  };

  handleTableAction(e) { console.log(e); }
}
