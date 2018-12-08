import { Component } from '@angular/core';

import { ItmGrid } from '../itm';
import { RadarExampleComponent } from './radar_example.component';

@Component({
  selector: 'itm-demo-basic-example',
  template: `<itm-grid [grid]="grid" [target]="data"></itm-grid>`
})
export class BasicExampleComponent {
  data: UserExample = {
    firstName: 'Hal',
    lastName: 'Kent',
    ipAddress: '98.201.19.90',
    gender: 'male'
  };

  grid: ItmGrid.Config<UserExample> = {
    template: `
      name        = gender radar
      ipAddress   = .      radar
    `,
    areas: [
      {key: 'ipAddress', text: ({ipAddress}) => ipAddress},
      {key: 'name', text: (user) => (`${user.firstName} ${user.lastName}`)},
      {key: 'gender', text: ({gender}) => (gender === 'male' ? '♂' : '♀')},
      {key: 'radar', comp: RadarExampleComponent}
    ]
  };
}

export interface UserExample {
  firstName: string;
  lastName: string;
  ipAddress: string;
  gender: 'male' | 'female';
}
