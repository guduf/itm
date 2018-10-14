// tslint:disable-next-line:max-line-length
import { Component, EventEmitter, OnChanges, Input, SimpleChanges, HostBinding, Output } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import ActionEvent from './action-event';
import Area from './area';
import Grid from './grid';
import { List } from 'immutable';
import ItmRecordFactory from './record-factory';

/** The selector of ItmGridComponent. */
const SELECTOR = 'itm-grid';

@Component({
  selector: SELECTOR,
  template: `
    <div *ngFor="let fragment of fragments"
      [class]="getAreaClass(fragment)" [style.gridArea]="getAreaStyle(fragment)">
      <ng-container
        [itmArea]="getAreaRecord(fragment)"
        [action]="action"
        [target]="target"></ng-container>
    </div>
  `
})
export class ItmGridComponent<T = {}> implements OnChanges {
  @Input()
  /** The configuration of the grid. */
  grid: Grid.Config = null;

  @Input()
  /** The target of the grid. */
  target: T;

  @Output()
  /** The emitter of action events. */
  action = new EventEmitter<ActionEvent<T>>();

  /** The grid grid area map of the displayed areas. */
  fragments: string[];

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

  get record(): Grid { return this._record; }

  private _record?: Grid;

  constructor(
    private _sanitizer: DomSanitizer
  ) { }

  getAreaRecord(fragment: string): Area<T> {
    return this.record.positions.get(fragment).area;
  }

  getAreaStyle(fragment: string): SafeStyle {
    const {row, col, width, height} = this.record.positions.get(fragment);
    return this._sanitizer.bypassSecurityTrustStyle(
      `${row} / ${col} / ${row + height} / ${col + width}`
    );
  }

  getAreaClass(fragment: string): string {
    const {key} = this.record.positions.get(fragment);
    return `${SELECTOR}-area ${SELECTOR}-key-${key}`;
  }

  ngOnChanges({grid: gridChanges}: SimpleChanges) {
    if (gridChanges) {
      this._record = Grid.factory.serialize(this.grid);
      this.fragments = this._record.positions.keySeq().toArray();
      this.size = [this._record.template.first(List()).size, this._record.template.size];
    }
  }
}
