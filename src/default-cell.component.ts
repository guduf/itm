import { Component, HostBinding, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ItmColumnDef } from './column';
import { Itm } from './item';

const SELECTOR = 'itm-default-cell';

@Component({
  selector: SELECTOR,
  template: `{{rendered | async}}`
})
/**
 * Entry component created by CellDirective
 * when no component class is specified as cell for the ItmColumnDef. */
export class ItmDefaultCellComponent {
  @HostBinding('class')
  /** The css class attached to the host. */
  get hostClass() { return SELECTOR; }

  rendered: Observable<string>;

  constructor(
    column: ItmColumnDef,
    private item: Itm
  ) {
    console.log(item, this.item);
    this.rendered = column.defaultText(this.item);
  }
}
