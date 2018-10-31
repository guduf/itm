// tslint:disable-next-line:max-line-length
import { Component, EventEmitter, OnChanges, Input, SimpleChanges, HostBinding, Output, Inject, OnDestroy, StaticProvider, InjectionToken, ChangeDetectionStrategy } from '@angular/core';
import { Map, Range } from 'immutable';

import ItmConfig from './config';
import Grid from './grid';
import Template from './grid-template';
import { ComponentWithSource } from './utils';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

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
  fragments: Template.Fragment[];

  /** The CSS class of the host element. */
  @HostBinding('class')
  get hostClass(): string { return [SELECTOR, this.ngClass].join(' '); }

  get gridRecord(): Grid { return this._grid; }

  @HostBinding('style.gridTemplateColumns')
  get gridTemplateColumnsStyle(): SafeStyle { return this._hostStyle.gridTemplateColumns; }

  @HostBinding('style.gridTemplateRows')
  get gridTemplateRowsStyle(): SafeStyle { return this._hostStyle.gridTemplateRows; }

  private _grid?: Grid;

  private _hostStyle: { gridTemplateColumns: SafeStyle, gridTemplateRows: SafeStyle };

  private _areaRefs: Map<Template.Fragment, Grid.AreaRef>;

  constructor(
    private _config: ItmConfig,
    private _sanitizer: DomSanitizer
  ) {
    super();
  }

  getAreaRef(fragment: Template.Fragment): Grid.AreaRef { return this._areaRefs.get(fragment); }

  getAreaStyle(fragment: Template.Fragment): { [key: string]: string } {
    const {row, col, width, height} = this.gridRecord.positions.get(fragment);
    return {gridArea: `${row} / ${col} / ${row + height} / ${col + width}`};
  }

  getAreaClass(fragment: Template.Fragment): string {
    const {rows, cols} = Template.getRange(this.gridRecord.positions);
    const {row, col, width, height} = this.gridRecord.positions.get(fragment);
    const areaClass: string[] = [`${SELECTOR}-area`];
    if (col === 1) areaClass.push(`${SELECTOR}-first-col`);
    if (col + width === cols) areaClass.push(`${SELECTOR}-last-col`);
    if (row === 1) areaClass.push(`${SELECTOR}-first-row`);
    if (row + height === rows) areaClass.push(`${SELECTOR}-last-row`);
    return areaClass.join(' ');
  }

  ngOnChanges({grid: gridChanges, source: sourceChanges}: SimpleChanges) {
    if (sourceChanges) super.ngOnChanges({source: sourceChanges});
    if (gridChanges) {
      this._grid = Grid.factory.serialize(this.grid);
      this._areaRefs = Grid.parseAreaRefs(this._config, this._grid, this._target);
      this.fragments = this._grid.positions.keySeq().toArray();
      this._setGridStyle();
    }
  }

  private _setGridStyle(): void {
    const rhythm = '60px';
    const range = Template.getRange(this.gridRecord.positions);
    const initialCols = Range(0, range.cols).map(() => -1).toArray();
    const initialRows = Range(0, range.rows).map(() => -1).toArray();
    const {rows, cols} = this.gridRecord.positions.reduce(
      (acc, pos, frag) => {
        const {area} = this._areaRefs.get(frag);
        const flexWidth = area.size.flexWidth / pos.width;
        const flexHeight = area.size.flexHeight / pos.height;
        return {
          rows: acc.rows.map((val, i) => (
            (i + 1 < pos.row || i + 2 > pos.row + pos.height) ? val :
              val < 0 ? flexHeight : Math.min(val, flexHeight)
          )),
          cols: acc.cols.map((val, i) => (
            (i + 1 < pos.col || i + 2 > pos.col + pos.width) ? val :
            val < 0 ? flexWidth : Math.min(val, flexWidth)
          ))
        };
      },
      {rows: initialRows, cols: initialCols}
    );
    this._hostStyle = {
      gridTemplateColumns: this._sanitizer.bypassSecurityTrustStyle(
        cols.map(col => col > 0 ? `minmax(${rhythm} , ${col}fr)` : rhythm).join(' ')
      ),
      gridTemplateRows: this._sanitizer.bypassSecurityTrustStyle(
        rows.map(row => row > 0 ? `minmax(${rhythm}, ${row}fr)` : rhythm).join(' ')
      )
    };
  }
}
