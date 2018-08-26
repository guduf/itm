import { Directive, Input, OnInit } from '@angular/core';

import { AbstractItmCellDirective } from './abstract-cell.directive';
import { Itm } from './item';

@Directive({selector: '[itmCell]'})
// tslint:disable-next-line:max-line-length
export class ItmCellDirective extends AbstractItmCellDirective implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('itmCell')
  /** The item of the cell. */
  item: Itm;

  ngOnInit() {
    this._createCellComponent(
      this.column.cell || this._config.defaultCellComp,
      [{provide: Itm, useValue: this.item}]
    );
  }
}
