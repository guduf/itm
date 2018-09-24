// tslint:disable-next-line:max-line-length
import { Component, EventEmitter, OnChanges, Input, SimpleChanges, HostBinding, Output } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { ItmActionEvent } from './action';
import { ItmGridConfig, ItmGridDef, ItmGridArea } from './grid';

/** The selector of ItmGridComponent. */
const SELECTOR = 'itm-grid';

@Component({
  selector: SELECTOR,
  template: `
    <div *ngFor="let gridArea of gridAreas" [style.gridArea]="getGridAreaStyle(gridArea)">
      <ng-container [itmGridArea]="gridArea" [action]="action" [target]="target"></ng-container>
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

  getGridAreaStyle(gridArea: ItmGridArea): SafeStyle {
    if (!gridArea) return;
    const {row, col, width, height} = gridArea;
    return this._sanitizer.bypassSecurityTrustStyle(
      `${row} / ${col} / ${row + height} / ${col + width}`
    );
  }

  ngOnChanges({grid: gridChanges}: SimpleChanges) {
    if (gridChanges) {
      const previous: ItmGridConfig = (gridChanges.isFirstChange ? {} : gridChanges.previousValue);
      if (previous === this.grid) return;
      const {gridAreas, template}: ItmGridDef = (
        this.grid instanceof ItmGridDef ? this.grid : new ItmGridDef(this.grid)
      );
      this.gridAreas = gridAreas;
      this.size = [template[0].length, template.length];
    }
  }
}
