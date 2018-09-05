import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

import { ItmActionDragEvent } from './drag.service';

@Component({
  selector: 'itm-list',
  template: `
  <ul class="itm-list" role="list"
    (itmDroppable)="drop.emit($event)" #droppableList="itmDroppable">
    <li *ngFor="let value of values" role="list-item" [itmDraggable]="value">
      <mat-icon>drag_indicator</mat-icon>
      <span>{{value}}</span>
    </li>
    <li *itmDropPlaceholderFor="droppableList">
    </li>
  </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItmListComponent<T> {
  @Input()
  values: string[];

  @Output()
  drop = new EventEmitter<ItmActionDragEvent<T>>();
}
