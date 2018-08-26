import { Component, HostBinding } from '@angular/core';
import { Observable, isObservable, of } from 'rxjs';

import { ItmColumnDef, ItmDefaultColumnData } from './column-def';
import { Itm } from './itm';

const SELECTOR = 'itm-default-cell';

@Component({
  selector: SELECTOR,
  template: `{{valueChanges | async}}`
})
/**
 * Entry component created by CellDirective
 * when no component class is specified as cell for the ItmColumnDef. */
export class ItmDefaultCellComponent {
  @HostBinding('class')
  /** The css class attached to the host */
  get hostClass() { return SELECTOR; }

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
