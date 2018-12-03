import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
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
import Registrer, { ITM_REGISTRER } from './registrer';
import Grid from './grid';
import GridFactory from './grid_factory';
import GridRef, { ITM_SHARED_RESOLVERS_TOKEN } from './grid_ref';
import Template from './grid_template';
import { map } from 'rxjs/operators';

/** The selector of ItmGridComponent. */
const SELECTOR = 'itm-grid';

const GRID_RHYTHM = '60px';

export interface AreaProps {
  ref: GridRef.AreaRef;
  ngStyle: { [key: string]: string };
  ngClass: string;
}

@Component({
  selector: SELECTOR,
  template: `
    <div *ngFor="let area of areas" [class]="area.ngClass" [ngStyle]="area.ngStyle">
      <ng-container [itmArea]="area.ref"></ng-container>
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

  /** The iterable for area directives. */
  areas: AreaProps[];

  /** The CSS class of the host element. */
  @HostBinding('class')
  get hostClass(): string { return [SELECTOR, this.ngClass].join(' '); }

  get record(): Grid { return this.ref ? this.ref.record : null; }

  @HostBinding('style.gridTemplateColumns')
  get gridTemplateColumnsStyle(): SafeStyle { return this._hostStyle.gridTemplateColumns; }

  @HostBinding('style.gridTemplateRows')
  get gridTemplateRowsStyle(): SafeStyle { return this._hostStyle.gridTemplateRows; }

  get ref(): GridRef { return this._ref; }

  private _hostStyle: { gridTemplateColumns: SafeStyle, gridTemplateRows: SafeStyle } = (
    {gridTemplateColumns: null, gridTemplateRows: null}
  );

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
    @Inject(ITM_REGISTRER)
    private _rgstr: Registrer
  ) {
    super({target: undefined, resolvers: Map()});
  }

  private _buildAreaProps(fragment: Template.Fragment): AreaProps {
    const {rows, cols} = Template.getRange(this.record.positions);
    const {row, col, width, height} = this.record.positions.get(fragment);
    const areaClass: string[] = [`${SELECTOR}-area`];
    if (col === 1) areaClass.push(`${SELECTOR}-first-col`);
    if (col + width === cols) areaClass.push(`${SELECTOR}-last-col`);
    if (row === 1) areaClass.push(`${SELECTOR}-first-row`);
    if (row + height === rows) areaClass.push(`${SELECTOR}-last-row`);
    const ngClass = areaClass.join(' ');
    const ngStyle = {gridArea: `${row} / ${col} / ${row + height} / ${col + width}`};
    const ref = this.ref.areas.get(fragment);
    return {ngClass, ngStyle, ref};
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes.grid) {
      if (this._sharedResolversSubscr) this._sharedResolversSubscr.unsubscribe();
      this._ref = null;
      this.areas = null;
      if (this.grid) try {
        const record = GridFactory(this.grid);
        this._ref = GridRef.buildRef(
          this._rgstr,
          record,
          this.behaviors.target,
          this._actionEmitter
        );
      }
      catch (err) {
        console.error('BUILD GRID ERROR', err);
        console.error('BUILD GRID ERROR CONTEXT', {grid: this.grid});
      }
      if (this.ref) {
        const sharedResolvers = (
          this.ref.injector.get(ITM_SHARED_RESOLVERS_TOKEN) as Observable<Action.Resolvers>
        );
        this._sharedResolversSubscr = sharedResolvers.subscribe(this._sharedResolversSub);
        this.areas = this.ref.record.positions.keySeq().reduce(
          (acc, fragment: Template.Fragment) => [...acc, this._buildAreaProps(fragment)],
          [] as AreaProps[]
        );
      }
      this._hostStyle = this._buildHostStyle();
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._sharedResolversSub.unsubscribe();
    this._actionEmitter.unsubscribe();
    this._actionSubscr.unsubscribe();
    if (this._sharedResolversSubscr) this._sharedResolversSubscr.unsubscribe();
  }

  private _buildHostStyle(): { gridTemplateColumns: SafeStyle, gridTemplateRows: SafeStyle } {
    if (!this.record) return { gridTemplateColumns: null, gridTemplateRows: null };
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
    return {
      gridTemplateColumns: this._sanitizer.bypassSecurityTrustStyle(
        cols.map(col => col > 0 ? `minmax(${GRID_RHYTHM} , ${col}fr)` : GRID_RHYTHM).join(' ')
      ),
      gridTemplateRows: this._sanitizer.bypassSecurityTrustStyle(
        rows.map(row => row > 0 ? `minmax(${GRID_RHYTHM}, ${row}fr)` : GRID_RHYTHM).join(' ')
      )
    };
  }
}
