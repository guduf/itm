import { Component, HostBinding, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ITM_DEFAULT_CELL_VALUE_CHANGES } from './column-def';

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

  constructor(
    @Inject(ITM_DEFAULT_CELL_VALUE_CHANGES)
    /** The value changes to display. */
    public valueChanges: Observable<string>
  ) { }
}
