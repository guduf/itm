import { Component, HostBinding } from '@angular/core';
import { Observable, isObservable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { ItmColumnDef, ItmDefaultHeaderColumnData } from './column-def';
import { Itm, ItmsChanges } from './item';

const SELECTOR = 'itm-default-header-cell';

@Component({
  selector: SELECTOR,
  template: `{{headingChanges | async}}`
})
/**
 * Entry component created by HeaderCellDirective
 * when no component class is specified as header for the ItmColumnDef. */
export class ItmDefaultHeaderCellComponent<I extends Itm = Itm> {
  /** The heading changes to display. */
  headingChanges: Observable<string>;

  @HostBinding('class')
  /** The css class attached to the host */
  get hostClass() { return SELECTOR; }

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
