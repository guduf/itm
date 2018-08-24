import { Component } from '@angular/core';
import { Observable, isObservable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { ItmColumnDef, ItmDefaultHeaderColumnData } from './column-def';
import { Itm, ItmsChanges } from './itm';

@Component({
  selector: 'itm-default-header-cell',
  template: '{{headingChanges | async}}'
})
/**
 * Entry component created by HeaderCellDirective
 * when no component class is specified as header for the ItmColumnDef. */
export class ItmDefaultHeaderCellComponent<I extends Itm = Itm> {
  /** The heading changes to display. */
  headingChanges: Observable<string>;

  constructor(
    itemsChanges: ItmsChanges<I>,
    column: ItmColumnDef<ItmDefaultHeaderColumnData<I>>
  ) {
    this.headingChanges = itemsChanges.pipe(flatMap(items => {
      const res = column.data.setHeadingChanges(items);
      return isObservable(res) ? res : of(res);
    }));
  }
}
