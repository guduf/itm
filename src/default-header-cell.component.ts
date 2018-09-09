import { Component, HostBinding, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ItmColumnDef } from './column';
import { Itm, ItmsChanges } from './item';
import { map, flatMap, tap } from 'rxjs/operators';
import { pipe } from '@angular/core/src/render3/pipe';

const SELECTOR = 'itm-default-header-cell';

@Component({
  selector: SELECTOR,
  template: `{{rendered | async}}`
})
/**
 * Entry component created by ItmHeaderCellDirective
 * when no component class is specified as cell for the ItmColumnDef. */
export class ItmDefaultHeaderCellComponent<I extends Itm = Itm> {
  @HostBinding('class')
  /** The css class attached to the host. */
  get hostClass() { return SELECTOR; }

  rendered: Observable<string>;

  constructor(
    column: ItmColumnDef<I>,
    itemsChanges: ItmsChanges<I>
  ) {
    this.rendered = itemsChanges.pipe(
      flatMap(items => column.defaultHeader(items)),
    );
  }
}
