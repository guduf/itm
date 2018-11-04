// import {
//   Component,
//   EventEmitter,
//   Input,
//   OnChanges,
//   SimpleChanges,
//   HostBinding,
//   Output
// } from '@angular/core';

// import Action from './action';
// import Grid from './grid';
// import Table from './table';
// import TableFactory from './table_factory';

// const SELECTOR = 'itm-table';

// @Component({
//   selector: SELECTOR,
//   template: `
//     <ng-container *ngIf="tableRecord as table">
//       <itm-grid
//         [grid]="table.header" [target]="target"
//         [ngClass]="headerRowClass"
//         (action)="action.emit($event)"></itm-grid>
//       <itm-grid *ngFor="let rowTarget of target"
//         [grid]="table" [target]="rowTarget"
//         [ngClass]="rowClass"
//         (action)="action.emit($event)"></itm-grid>
//     </ng-container>
//   `
// })
// // tslint:disable-next-line:max-line-length
// export class ItmTableComponent<T extends Object = {}> implements OnChanges {
//   @Input()
//   /** The configuration of the table. */
//   table: Grid.Config;

//   @Input()
//   /** The target of the table. */
//   target: T[];

//   @Output()
//   action = new EventEmitter<Action.Generic<T | T[]>>();

//   readonly headerRowClass = `${SELECTOR}-header-row`;

//   readonly rowClass = `${SELECTOR}-row`;

//   @HostBinding('class')
//   get hostClass(): string { return SELECTOR; }

//   get tableRecord(): Table { return this._table; }

//   private _table: Table;

//   ngOnChanges({table: tableChanges}: SimpleChanges) {
//     if (tableChanges) (this._table = TableFactory(this.table));
//   }
// }
