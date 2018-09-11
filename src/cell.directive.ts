import { Directive, Input, OnInit } from '@angular/core';

import { Itm } from './item';
import { ItmConfig } from './config';
import { ItmColumnDef } from './column';
import { ItmActionDef } from './action';
import { ItmColumnDirective } from './column.directive';

/** The directive assigned to the row cell of a ItmTable */
@Directive({selector: '[itmCell]'})
export class ItmCellDirective<
  I extends Itm = Itm,
  A extends ItmActionDef<I> = ItmActionDef<I>
> extends ItmColumnDirective<I, I, A> implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('itmCell')
  column: ItmColumnDef;

  ngOnInit() {
    this._createComponent(this.column.text || this._injector.get(ItmConfig).defaultCellComp);
  }
}
