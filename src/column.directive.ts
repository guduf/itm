import { ItmTypedAreaDirective } from './area.directive';
import { Itm } from './item';
import { ComponentType } from './utils';
import { StaticProvider, Injectable } from '@angular/core';
import { ItmColumnDef } from './column';
import { ItmActionDef } from './action';

@Injectable()
export abstract class ItmColumnDirective<
  I extends Itm = Itm,
  II extends (I | I[]) = I,
  A extends ItmActionDef<II> = ItmActionDef<II>
> extends ItmTypedAreaDirective<I, II, A> {
  abstract column: ItmColumnDef;

  /** Create the component in the view container */
  protected _createComponent(component: ComponentType, providers: StaticProvider[] = []): void {
    if (!(this.column instanceof ItmColumnDef)) throw new TypeError('Expected column');
    providers = [
      {provide: ItmColumnDef, useValue: this.column},
      ...this.column.providers,
      ...providers
    ];
    super._createComponent(component, providers);
  }
}
