import { Component, HostBinding, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ITM_DEFAULT_HEADER_CELL_VALUE_CHANGES } from './column-def';

const SELECTOR = 'itm-default-header-cell';

@Component({
  selector: SELECTOR,
  template: `{{valueChanges | async}}`
})
/**
 * Entry component created by ItmHeaderCellDirective
 * when no component class is specified as cell for the ItmColumnDef. */
export class ItmDefaultHeaderCellComponent {
  @HostBinding('class')
  /** The css class attached to the host. */
  get hostClass() { return SELECTOR; }

  constructor(
    @Inject(ITM_DEFAULT_HEADER_CELL_VALUE_CHANGES)
    /** The value changes to display. */
    public valueChanges: Observable<string>
  ) { }
}
