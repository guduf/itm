import {
  Directive,
  Input
} from '@angular/core';

import { ItmColumnDef } from './column';
import { Itm, ItmsChanges } from './itm';

@Directive({selector: '[itmCell]'})
// tslint:disable-next-line:directive-class-suffix
export class ItmCellDirectiveMock<I extends Itm = Itm> {
  // tslint:disable-next-line:no-input-rename
  @Input('itmCell')
  column: ItmColumnDef;

  @Input()
  item: Itm;
}

@Directive({selector: '[itmHeaderCell]'})
// tslint:disable-next-line:directive-class-suffix
export class ItmHeaderCellDirectiveMock<I extends Itm = Itm> {
  // tslint:disable-next-line:no-input-rename
  @Input('itmHeaderCell')
  column: ItmColumnDef;

  @Input()
  itemsChanges: ItmsChanges<I>;
}
