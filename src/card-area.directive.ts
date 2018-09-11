import { Directive, Input, OnInit } from '@angular/core';

import { Itm } from './item';
import { ItmConfig } from './config';
import { ItmTypedAreaDirective } from './area.directive';
import { ItmAreaDef } from './area-def';

@Directive({selector: '[itmCardArea]'})
/** The directive assigned to the row cell of a ItmTable */
// tslint:disable-next-line:max-line-length
export class ItmCardAreaDirective<I extends Itm = Itm> extends ItmTypedAreaDirective<I, I> implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('itmCardArea')
  area: ItmAreaDef;

  ngOnInit() {
    if (!(this.area instanceof ItmAreaDef)) throw new TypeError('Expected area');
    this._createComponent(
      this.area.text || this._injector.get(ItmConfig).defaultCardAreaComp,
      [{provide: ItmAreaDef, useValue: this.area}]
    );
  }
}
