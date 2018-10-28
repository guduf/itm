import { Component } from '@angular/core';

import { DATA } from './data';
import Grid from 'src/grid';
import { User } from './user';

@Component({
  selector: 'app-root',
  template: `
    <itm-grid [grid]="'user' | itmTypeForm:grid" [source]="data[0]"></itm-grid>
    <itm-table [table]="'user' | itmTypeTable" [source]="data"></itm-table>
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
