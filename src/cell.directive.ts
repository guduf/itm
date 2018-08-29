import { Directive, Input, OnInit } from '@angular/core';

import { AbstractItmCellWithColumnDirective } from './abstract-cell.directive';
import { Itm } from './item';
import { ItmConfig } from './config';

@Directive({selector: '[itmCell]'})
/** The directive assigned to the row cell of a ItmTable */
export class ItmCellDirective extends AbstractItmCellWithColumnDirective implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('itmCell')
  /** The item of the cell. */
  item: Itm;

  ngOnInit() {
    this._createCellComponent(
      this.column.cell || this._injector.get(ItmConfig).defaultCellComp,
      [{provide: Itm, useValue: this.item}]
    );
  }
}
