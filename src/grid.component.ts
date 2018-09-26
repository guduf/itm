// tslint:disable-next-line:max-line-length
import { Component, EventEmitter, OnChanges, Input, SimpleChanges, HostBinding, Output, StaticProvider } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { ItmActionEvent } from './action';
import { ItmGridConfig, ItmGrid, ItmGridArea } from './grid';

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
  grid: ItmGridConfig;

  @Input()
  /** The target of the grid. */
  target: T;

  @Output()
  /** The emitter of action events. */
  action = new EventEmitter<ItmActionEvent<T>>();

  /** The grid grid area map of the displayed areas. */
  gridAreas: ItmGridArea[];

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

  getAreaProviders(gridArea: ItmGridArea): StaticProvider[] {
    return [{provide: ItmGridArea, useValue: gridArea}];
  }

  getAreaStyle(gridArea: ItmGridArea): SafeStyle {
    const {row, col, width, height} = gridArea;
    return this._sanitizer.bypassSecurityTrustStyle(
      `${row} / ${col} / ${row + height} / ${col + width}`
    );
  }

  getAreaClass(gridArea: ItmGridArea): string {
    const {key} = gridArea;
    return `${SELECTOR}-area ${SELECTOR}-key-${key}`;
  }

  ngOnChanges({grid: gridChanges}: SimpleChanges) {
    if (gridChanges) {
      const previous: ItmGridConfig = (gridChanges.isFirstChange ? {} : gridChanges.previousValue);
      if (previous === this.grid) return;
      const {gridAreas, template}: ItmGrid = (
        this.grid instanceof ItmGrid ? this.grid : new ItmGrid(this.grid)
      );
      this.gridAreas = gridAreas;
      this.size = [template[0].length, template.length];
    }
  }
}
