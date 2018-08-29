import { Directive, Input, OnInit } from '@angular/core';

import { AbstractItmCellWithColumnDirective } from './abstract-cell.directive';
import { ItmsChanges } from './item';
import { ItmConfig } from './config';

@Directive({selector: '[itmHeaderCell]'})
/** The directive assigned to the header row cell of a ItmTable */
export class ItmHeaderCellDirective extends AbstractItmCellWithColumnDirective implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('itmHeaderCell')
  /** The items changes of the table. */
  itemsChanges: ItmsChanges;

  ngOnInit() {
    this._createCellComponent(
      this.column.header || this._injector.get(ItmConfig).defaultHeaderCellComp,
      [{provide: ItmsChanges, useValue: this.itemsChanges}]
    );
  }
}
