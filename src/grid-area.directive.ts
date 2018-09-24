import { Directive, Input, OnInit } from '@angular/core';

 import { ItmConfig } from './config';
import { ItmAreaDirective } from './area.directive';
import { ItmGridArea } from './grid';

@Directive({selector: '[itmGridArea]'})
/** The directive assigned to the row cell of a ItmTable */
// tslint:disable-next-line:max-line-length
export class ItmGridAreaDirective<T = {}> extends ItmAreaDirective<T> implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('itmGridArea')
  gridArea: ItmGridArea;

  ngOnInit() {
    if (!(this.gridArea instanceof ItmGridArea)) throw new TypeError('Expected ItmGridArea');
    this.area = this.gridArea.area;
    this._createComponent(
      this.area.cell || this._injector.get(ItmConfig).defaultTextAreaComp,
      [{provide: ItmGridArea, useValue: this.gridArea}]
    );
  }
}
