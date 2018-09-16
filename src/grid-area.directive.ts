import { Directive, Input, OnInit } from '@angular/core';

import { Itm } from './item';
import { ItmConfig } from './config';
import { ItmTypedAreaDirective } from './area.directive';
import { ItmAreaDef } from './area-def';

@Directive({selector: '[itmGridArea]'})
/** The directive assigned to the row cell of a ItmTable */
// tslint:disable-next-line:max-line-length
export class ItmGridAreaDirective<I extends Itm = Itm> extends ItmTypedAreaDirective<I, I> implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('itmGridArea')
  area: ItmAreaDef;

  ngOnInit() {
    if (!(this.area instanceof ItmAreaDef)) throw new TypeError('Expected area');
    this._createComponent(
      this.area.cell || this._injector.get(ItmConfig).defaultTextAreaComp,
      [{provide: ItmAreaDef, useValue: this.area}]
    );
  }
}
