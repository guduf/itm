import {
  Injectable,
  OnInit,
  ComponentFactoryResolver,
  Injector,
  ViewContainerRef,
  StaticProvider
} from '@angular/core';

import { ItmColumnDef } from './column';
import { ItmConfig } from './itm-config';
import { CmpClass } from './utils';

@Injectable()
export abstract class AbstractItmCellDirective implements OnInit {
  /** The column of the cell. */
  abstract column: ItmColumnDef;

  constructor(
    protected _config: ItmConfig,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _injector: Injector,
    private _viewContainerRef: ViewContainerRef,
  ) { }

  abstract ngOnInit();

  /** Create the component in the MatTableCell */
  protected _createCellComponent(cmpClass: CmpClass, providers: StaticProvider[] = []): void {
    if (!(this.column instanceof ItmColumnDef)) throw new TypeError('Expected column input');
    providers = [...providers, {provide: ItmColumnDef, useValue: this.column}];
    const injector = Injector.create(providers, this._injector);
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(cmpClass);
    this._viewContainerRef.clear();
    this._viewContainerRef.createComponent(componentFactory, null, injector);
  }
}
