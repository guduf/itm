// tslint:disable-next-line:max-line-length
import { Component, EventEmitter, OnChanges, Input, SimpleChanges, HostBinding, Output, Inject, OnDestroy, StaticProvider, InjectionToken } from '@angular/core';
import { List, Map } from 'immutable';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';

import ItmConfig from './config';
import Grid from './grid';

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
  `
})
export class ItmGridComponent<T extends Object = {}> implements OnChanges, OnDestroy {
  @Input()
  /** The configuration of the grid. */
  grid: Grid.Config = null;

  @Input()
  /** The target of the grid. */
  source: T | Observable<T>;

  @Output()
  /** The emitter of action events. */
  action = new EventEmitter();

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

  get gridRecord(): Grid { return this._grid; }

  get target() { return this._target.value; }

  private _grid?: Grid;
  private _areaRefs: Map<string, Grid.AreaRef>;
  private _target = new BehaviorSubject<T>(undefined);
  private _sourceSubscr: Subscription;

  constructor(
    private _config: ItmConfig
  ) { }

  getAreaRef(fragment: string): Grid.AreaRef {
    return this._areaRefs.get(fragment);
  }

  getAreaStyle(fragment: string): { [key: string]: string } {
    const {row, col, width, height} = this.gridRecord.positions.get(fragment);
    return {
      gridArea: `${row} / ${col} / ${row + height} / ${col + width}`
    };
  }

  getAreaClass(fragment: string): string {
    const {key} = this.gridRecord.positions.get(fragment);
    return `${SELECTOR}-area ${SELECTOR}-key-${key}`;
  }

  ngOnChanges({grid: gridChanges, source: sourceChanges}: SimpleChanges) {
    if (sourceChanges) {
      if (this._sourceSubscr) this._sourceSubscr.unsubscribe();
      if (this.source instanceof Observable) this._sourceSubscr = this.source.subscribe(
        items => this._target.next(items),
        err => console.error(err)
      );
      else {
        this._sourceSubscr = null;
        this._target.next(this.source);
      }
    }
    if (gridChanges) {
      this._grid = Grid.factory.serialize(this.grid);
      this._areaRefs = Grid.parseAreaRefs(this._config, this._grid, this._target);
      this.fragments = this._grid.positions.keySeq().toArray();
      this.size = [this._grid.template.first(List()).size, this._grid.template.size];
    }
  }

  ngOnDestroy() {
    if (this._sourceSubscr) this._sourceSubscr.unsubscribe();
  }
}
