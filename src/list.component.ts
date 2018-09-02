import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'itm-list',
  template: `
    <ul itmDroppable #droppableList="itmDroppable">
      <li  *ngFor="let value of values" itmDraggable>
          {{value}}
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItmListComponent {
  @Input()
  values: string[];
}
