import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ItmDragActionEvent } from './drag-action.service';

@Component({
  selector: 'itm-list',
  template: `
  <ul class="itm-list" role="list"
    (itmDroppable)="drop.emit($event)" #droppableList="itmDroppable">
    <li *ngFor="let value of values"
      role="list-item"
      [itmDraggable]="value" (drop)="onDrop($event)">
      <mat-icon>drag_indicator</mat-icon>
      <span>{{value}}</span>
    </li>
    <li *itmDropPlaceholderFor="droppableList">
    </li>
  </ul>
  `
})
export class ItmListComponent<T> {
  @Input()
  values: string[];

  @Output()
  drop = new EventEmitter<ItmDragActionEvent<T>>();

  onDrop(e: ItmDragActionEvent<T>) {
    console.log(e);
  }
}
