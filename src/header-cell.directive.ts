import { Directive, Input, OnInit } from '@angular/core';

import { AbstractItmCellDirective } from './abstract-cell.directive';
import { ItmsChanges } from './itm';

@Directive({selector: '[itmHeaderCell]'})
// tslint:disable-next-line:max-line-length
export class ItmHeaderCellDirective extends AbstractItmCellDirective implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('itmHeaderCell')
  /** The items changes of the table. */
  itemsChanges: ItmsChanges;

  ngOnInit() {
    this._createCellComponent(
      this.column.header || this._config.defaultHeaderCellComp,
      [{provide: ItmsChanges, useValue: this.itemsChanges}]
    );
  }
}
