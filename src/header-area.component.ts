import { Component, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { ItmPropAreaDef } from './area-def';
import { Itm, ItmsChanges } from './item';

const SELECTOR = 'itm-default-header-area';

@Component({
  selector: SELECTOR,
  template: `{{rendered | async}}`
})
/**
 * Entry component created by ItmHeaderAreaDirective
 * when no component class is specified as cell for the ItmColumnDef. */
export class ItmHeaderAreaComponent<I extends Itm = Itm> {
  @HostBinding('class')
  /** The css class attached to the host. */
  get hostClass() { return SELECTOR; }

  /** The rendered string observable for the header. */
  rendered: Observable<string>;

  constructor(
    propArea: ItmPropAreaDef<I>,
    itemsChanges: ItmsChanges<I>
  ) {
    this.rendered = itemsChanges.pipe(
      flatMap(items => propArea.defaultHeader(items)),
    );
  }
}
