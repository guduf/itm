import { Component } from '@angular/core';

@Component({
  selector: 'itm-demo-basic-example-container',
  templateUrl: 'basic_example_container.component.html',
  styleUrls: ['basic_example_container.component.scss']
})
export class BasicExampleContainerComponent {
  activated: 'basic' | 'radar' = 'basic';
}
