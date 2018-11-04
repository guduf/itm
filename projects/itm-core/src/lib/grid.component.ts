import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { Map, Range } from 'immutable';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';

import Action from './action';
import ActionEmitter from './action_emitter';
import { WithBehaviors } from './behavior';
import ItmConfig from './config';
import Grid from './grid';
import GridRef, { ITM_SHARED_RESOLVERS_TOKEN } from './grid_ref';
import Template from './grid_template';
import { map } from 'rxjs/operators';

/** The selector of ItmGridComponent. */
const SELECTOR = 'itm-grid';

const GRID_RHYTHM = '60px';

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
export class ItmGridComponent<A extends Action<T> = Action<T>, T extends Object = {}> extends WithBehaviors<{ target: T, resolvers: Action.Resolvers }> implements OnChanges, OnDestroy {
  @Input()
  /** The configuration of the grid. */
  grid: Grid.Config = null;

  @Input()
  /** The configuration of the grid. */
  ngClass: string;

  @Input()
  resolvers: { [key: string]: Action.Resolver<T> };

  @Output()
  /** The emitter of action events. */
  action = new EventEmitter<A>();

  @Input()
  /** The target of the grid. */
  target: T;

  /** The grid grid area map of the displayed areas. */
  fragments: Template.Fragment[];

  /** The CSS class of the host element. */
  @HostBinding('class')
  get hostClass(): string { return [SELECTOR, this.ngClass].join(' '); }

  get record(): Grid { return this.ref.record; }

  @HostBinding('style.gridTemplateColumns')
  get gridTemplateColumnsStyle(): SafeStyle { return this._hostStyle.gridTemplateColumns; }

  @HostBinding('style.gridTemplateRows')
  get gridTemplateRowsStyle(): SafeStyle { return this._hostStyle.gridTemplateRows; }

  get ref(): GridRef { return this._ref; }

  private _hostStyle: { gridTemplateColumns: SafeStyle, gridTemplateRows: SafeStyle };

  private _ref: GridRef;

  private readonly _sharedResolversSub = new BehaviorSubject<Action.Resolvers<T>>(Map());

  private _sharedResolversSubscr: Subscription;

  private readonly _resolversObs = (
    combineLatest(this._sharedResolversSub, this.behaviors.resolvers).pipe(
      map(([shared, inputs]) => shared.merge(inputs)),
    )
  );

  private readonly _actionEmitter = new ActionEmitter(this.behaviors.target, this._resolversObs);

  private _actionSubscr = this._actionEmitter.action.subscribe(this.action);

  constructor(
    private _sanitizer: DomSanitizer,
    private _config: ItmConfig
  ) {
    super({target: undefined, resolvers: Map()});
  }

  getAreaRef(fragment: Template.Fragment): GridRef.AreaRef { return this.ref.areas.get(fragment); }

  getAreaStyle(fragment: Template.Fragment): { [key: string]: string } {
    const {row, col, width, height} = this.record.positions.get(fragment);
    return {gridArea: `${row} / ${col} / ${row + height} / ${col + width}`};
  }

  getAreaClass(fragment: Template.Fragment): string {
    const {rows, cols} = Template.getRange(this.record.positions);
    const {row, col, width, height} = this.record.positions.get(fragment);
    const areaClass: string[] = [`${SELECTOR}-area`];
    if (col === 1) areaClass.push(`${SELECTOR}-first-col`);
    if (col + width === cols) areaClass.push(`${SELECTOR}-last-col`);
    if (row === 1) areaClass.push(`${SELECTOR}-first-row`);
    if (row + height === rows) areaClass.push(`${SELECTOR}-last-row`);
    return areaClass.join(' ');
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes.grid) {
      if (this._sharedResolversSubscr) this._sharedResolversSubscr.unsubscribe();
      const record = GridFactory(this.grid);
      try {
        this._ref = GridRef.buildRef(
          this._config,
          record,
          this.behaviors.target,
          this._actionEmitter
        );
      } catch (err) {
        console.error('BUILD GRID ERROR', err);
        // tslint:disable-next-line:max-line-length
        console.error('BUILD GRID ERROR CONTEXT', {record: record.toJS()});
        return;
      }
      const sharedResolvers = (
        this.ref.injector.get(ITM_SHARED_RESOLVERS_TOKEN) as Observable<Action.Resolvers>
      );
      this._sharedResolversSubscr = sharedResolvers.subscribe(this._sharedResolversSub);
      this.fragments = record.positions.keySeq().toArray();
      this._setHostStyle();
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._sharedResolversSub.unsubscribe();
    this._actionEmitter.unsubscribe();
    this._actionSubscr.unsubscribe();
    if (this._sharedResolversSubscr) this._sharedResolversSubscr.unsubscribe();
  }

  private _setHostStyle(): void {
    const range = Template.getRange(this.record.positions);
    const initialCols = Range(0, range.cols).map(() => -1).toArray();
    const initialRows = Range(0, range.rows).map(() => -1).toArray();
    const {rows, cols} = this.record.positions.reduce(
      (acc, pos, frag) => {
        const {record} = this.ref.areas.get(frag);
        const flexWidth = record.size.flexWidth / pos.width;
        const flexHeight = record.size.flexHeight / pos.height;
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
        cols.map(col => col > 0 ? `minmax(${GRID_RHYTHM} , ${col}fr)` : GRID_RHYTHM).join(' ')
      ),
      gridTemplateRows: this._sanitizer.bypassSecurityTrustStyle(
        rows.map(row => row > 0 ? `minmax(${GRID_RHYTHM}, ${row}fr)` : GRID_RHYTHM).join(' ')
      )
    };
  }
}
