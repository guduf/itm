// tslint:disable-next-line:max-line-length
import { Component, EventEmitter, OnChanges, Input, SimpleChanges, HostBinding, Output, Inject, OnDestroy, StaticProvider, InjectionToken, ChangeDetectionStrategy } from '@angular/core';
import { List, Map } from 'immutable';

import ItmConfig from './config';
import Grid from './grid';
import { ComponentWithSource } from './utils';

/** The selector of ItmGridComponent. */
const SELECTOR = 'itm-grid';

@Component({
  selector: SELECTOR,
  template: `
    <div *ngFor="let fragment of fragments"
      [class]="getAreaClass(fragment)"
      [ngStyle]="getAreaStyle(fragment)">
      <ng-container [itmArea]="getAreaRef(fragment)"></ng-container>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
// tslint:disable-next-line:max-line-length
export class ItmGridComponent<T extends Object = {}> extends ComponentWithSource<T> implements OnChanges, OnDestroy {
  @Input()
  /** The configuration of the grid. */
  grid: Grid.Config = null;

  @Input()
  /** The configuration of the grid. */
  ngClass: string;

  @Output()
  /** The emitter of action events. */
  action = new EventEmitter();

  /** The grid grid area map of the displayed areas. */
  fragments: Grid.Fragment[];

  @HostBinding('class')
  /** The CSS class of the host element. */
  get hostClass(): string {
    return [
      this.ngClass,
      SELECTOR,
      ...([
        `${SELECTOR}-columns-${this.gridRecord.size.first()}`,
        `${SELECTOR}-rows-${this.gridRecord.size.last()}`
      ])
    ].join(' ');
  }

  get gridRecord(): Grid { return this._grid; }

  private _grid?: Grid;
  private _areaRefs: Map<Grid.Fragment, Grid.AreaRef>;

  constructor(
    private _config: ItmConfig
  ) {
    super();
  }

  getAreaRef(fragment: Grid.Fragment): Grid.AreaRef {
    return this._areaRefs.get(fragment);
  }

  getAreaStyle(fragment: Grid.Fragment): { [key: string]: string } {
    const {row, col, width, height} = this.gridRecord.positions.get(fragment);
    return {
      gridArea: `${row} / ${col} / ${row + height} / ${col + width}`
    };
  }

  getAreaClass(fragment: Grid.Fragment): string {
    const cols = this.gridRecord.size.first(NaN);
    const rows = this.gridRecord.size.last(NaN);
    const {row, col, width, height} = this.gridRecord.positions.get(fragment);
    const areaClass: string[] = [`${SELECTOR}-area`];
    if (col === 1) areaClass.push(`${SELECTOR}-first-col`);
    if (col + width === cols + 1) areaClass.push(`${SELECTOR}-last-col`);
    if (row === 1) areaClass.push(`${SELECTOR}-first-row`);
    if (row + height === rows + 1) areaClass.push(`${SELECTOR}-last-row`);
    return areaClass.join(' ');
  }

  ngOnChanges({grid: gridChanges, source: sourceChanges}: SimpleChanges) {
    if (sourceChanges) super.ngOnChanges({source: sourceChanges});
    if (gridChanges) {
      this._grid = Grid.factory.serialize(this.grid);
      this._areaRefs = Grid.parseAreaRefs(this._config, this._grid, this._target);
      this.fragments = this._grid.positions.keySeq().toArray();
    }
  }
}
