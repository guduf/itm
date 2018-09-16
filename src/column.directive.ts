import { ItmTypedAreaDirective } from './area.directive';
import { Itm } from './item';
import { ComponentType } from './utils';
import { StaticProvider, Injectable, Directive, OnInit } from '@angular/core';
import { ItmColumnDef } from './column';
import { ItmActionDef } from './action';
import { ItmConfig } from './config';

@Injectable()
export abstract class ItmColumnDirective<
  I extends Itm = Itm,
  II extends (I | I[]) = I,
  A extends ItmActionDef<II> = ItmActionDef<II>
> extends ItmTypedAreaDirective<I, II, A> {
  area: ItmColumnDef<I>;

  /** Create the component in the view container */
  protected _createComponent(component: ComponentType, providers: StaticProvider[] = []): void {
    if (!(this.area instanceof ItmColumnDef)) throw new TypeError('Expected area');
    providers = [
      {provide: ItmColumnDef, useValue: this.area},
      ...providers
    ];
    super._createComponent(component, providers);
  }
}

@Directive({selector: '[itmColumnCellDirective]'})
// tslint:disable-next-line:max-line-length
export class ItmColumnCellDirective<I extends Itm = Itm, A extends ItmActionDef<I> = ItmActionDef<I>> extends ItmColumnDirective<I, I, A> implements OnInit {
  ngOnInit() {
    this._createComponent(this.area.cell || this._injector.get(ItmConfig).defaultTextAreaComp);
  }
}

@Directive({selector: '[itmColumnHeaderCellDirective]'})
// tslint:disable-next-line:max-line-length
export class ItmColumnHeaderCellDirective<I extends Itm = Itm, A extends ItmActionDef<I[]> = ItmActionDef<I[]>> extends ItmColumnDirective<I, I[], A> implements OnInit {
  ngOnInit() {
    this._createComponent(this.area.header || this._injector.get(ItmConfig).defaultHeaderAreaComp);
  }
}
