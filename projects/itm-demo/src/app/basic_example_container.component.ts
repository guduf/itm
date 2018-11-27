import { Component } from '@angular/core';
import { Range } from 'immutable';

@Component({
  selector: 'itm-demo-basic-example-container',
  templateUrl: 'basic_example_container.component.html',
  styleUrls: ['basic_example_container.component.scss']
})
export class BasicExampleContainerComponent {
  activated: 'basic' | 'radar' = 'basic';

  blueprintCells = Range(1, 8).toArray();
}
