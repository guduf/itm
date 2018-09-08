import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { ItmDragActionEvent } from './drag-action.service';

@Component({
  selector: 'itm-list',
  template: `
  <ul class="itm-list" role="list"
    (itmDroppable)="onDrop($event)" #droppableList="itmDroppable">
    <li *ngFor="let value of sortedValues" role="list-item" [itmDraggable]="value">
      <mat-icon>drag_indicator</mat-icon>
      <span>{{value}}</span>
    </li>
    <li *itmDropPlaceholderFor="droppableList"></li>
  </ul>
  `
})
export class ItmListComponent<T> implements OnChanges {
  @Input()
  values: T[];

  @Output()
  sort = new EventEmitter<ItmDragActionEvent<T>>();

  sortedValues: T[];

  ngOnChanges() {
    this.sortedValues = [...this.values];
  }

  onDrop(e: ItmDragActionEvent<T>) {
    if (!e.sameParent || e.oldIndex === e.newIndex) return;
    const values = [...this.sortedValues];
    const [target] = values.splice(e.oldIndex, 1);
    values.splice(e.newIndex, 0, target);
    this.sortedValues = values;
  }
}
