import { Component } from '@angular/core';
import { Observable, isObservable, of } from 'rxjs';

import { ItmColumnDef, ItmDefaultColumnData } from './column';
import { Itm } from './itm';

@Component({
  selector: 'itm-default-cell',
  template: '{{valueChanges | async}}'
})
/**
 * Entry component created by CellDirective
 * when no component class is specified as cell for the ItmColumnDef. */
export class ItmDefaultCellComponent {
  /** The value changes to display. */
  valueChanges: Observable<string>;

  constructor(
    item: Itm,
    column: ItmColumnDef<ItmDefaultColumnData>
  ) {
    const res = column.data.setValueChanges(item);
    this.valueChanges = isObservable(res) ? res : of(res);
  }
}
