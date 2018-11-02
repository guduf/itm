import { Component } from '@angular/core';

import { DATA } from './data';
import Grid from 'src/grid';
import { User } from './user';

@Component({
  selector: 'app-root',
  template: `
    <itm-form [form]="'user' | itmTypeForm:grid" [target]="data[0]"></itm-form>
    <itm-table [table]="'user' | itmTypeTable" [target]="[data[0]]"></itm-table>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data = DATA as User[];

  grid: Grid.Config = {
    template: `
      field:id          . gender    =
      firstName         = lastName  =
      email             = =
      control:ipAddress = .         button:submit
    `
  };
}
