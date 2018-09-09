import { Directive, Input, OnInit } from '@angular/core';

import { ItmsChanges, Itm } from './item';
import { ItmConfig } from './config';
import { ItmColumnDef } from './column';
import { Observable } from 'rxjs';
import { ItmColumnDirective } from './column.directive';

@Directive({selector: '[itmHeaderCell]'})
/** The directive assigned to the header row cell of a ItmTable */
// tslint:disable-next-line:max-line-length
export class ItmHeaderCellDirective<I extends Itm = Itm> extends ItmColumnDirective<I, I[]> implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('itmHeaderCell')
  column: ItmColumnDef;

  /** The items changes of the table. */
  @Input()
  itemsChanges: ItmsChanges;

  _injectItem = false;
  _injectItems = false;

  ngOnInit() {
    if (!(this.itemsChanges instanceof Observable)) throw new TypeError('Expected itemChanges');
    this._createComponent(
      this.column.header || this._injector.get(ItmConfig).defaultHeaderCellComp,
      [{provide: ItmsChanges, useValue: this.itemsChanges}]
    );
  }
}
