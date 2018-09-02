import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'itm-list',
  template: `
  <ul class="itm-list" role="list" itmDroppable #droppableList="itmDroppable">
    <li *ngFor="let value of values" role="list-item" itmDraggable>
      <mat-icon>drag_indicator</mat-icon>
      <span>{{value}}</span>
    </li>
    <li *itmDropPlaceholderFor="droppableList">
      <mat-icon>drag_indicator</mat-icon>
    </li>
  </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItmListComponent {
  @Input()
  values: string[];
}
