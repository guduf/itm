// tslint:disable-next-line:max-line-length
import { Component, EventEmitter, OnChanges, Input, SimpleChanges, HostBinding, Output, StaticProvider } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import ActionEvent from './action-event';
import Grid from './grid';
import GridArea from './grid-area';
import { List } from 'immutable';

/** The selector of ItmGridComponent. */
const SELECTOR = 'itm-grid';

@Component({
  selector: SELECTOR,
  template: `
    <div *ngFor="let gridArea of gridAreas"
      [class]="getAreaClass(gridArea)" [style.gridArea]="getAreaStyle(gridArea)">
      <ng-container
        [itmArea]="gridArea.area"
        [providers]="getAreaProviders(gridArea)"
        [action]="action"
        [target]="target"></ng-container>
    </div>
  `
})
export class ItmGridComponent<T = {}> implements OnChanges {
  @Input()
  /** The configuration of the grid. */
  grid: Grid.Config<T>;

  @Input()
  /** The target of the grid. */
  target: T;

  @Output()
  /** The emitter of action events. */
  action = new EventEmitter<ActionEvent<T>>();

  /** The grid grid area map of the displayed areas. */
  gridAreas: GridArea.Record[];

  /** The grid size of grid. The first member is for columns and the second for rows. */
  size: [number, number];

  @HostBinding('class')
  /** The CSS class of the host element. */
  get hostClass(): string {
    return [
      SELECTOR,
      ...(
        !this.size ? [] :
        [`${SELECTOR}-columns-${this.size[0]}`, `${SELECTOR}-rows-${this.size[1]}`]
      )
    ].join(' ');
  }

  constructor(
    private _sanitizer: DomSanitizer
  ) { }

  getAreaProviders(gridArea: GridArea.Record): StaticProvider[] {
    return [{provide: GridArea.RECORD_TOKEN, useValue: gridArea}];
  }

  getAreaStyle(gridArea: GridArea.Record): SafeStyle {
    const {row, col, width, height} = gridArea;
    return this._sanitizer.bypassSecurityTrustStyle(
      `${row} / ${col} / ${row + height} / ${col + width}`
    );
  }

  getAreaClass(gridArea: GridArea.Record): string {
    const {key} = gridArea;
    return `${SELECTOR}-area ${SELECTOR}-key-${key}`;
  }

  ngOnChanges({grid: gridChanges}: SimpleChanges) {
    if (gridChanges) {
      const previous: Grid.Config<T> = (gridChanges.isFirstChange ? {} : gridChanges.previousValue);
      if (previous === this.grid) return;
      const grid: Grid.Record = Grid.factory.serialize(this.grid);
      this.gridAreas = GridArea.parseGridAreas(grid).toArray();
      this.size = [grid.template.first(List()).size, grid.template.size];
    }
  }
}
