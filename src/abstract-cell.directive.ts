import {
  Injectable,
  ComponentFactoryResolver,
  Injector,
  ViewContainerRef,
  StaticProvider,
  Input
} from '@angular/core';

import { ComponentType } from './utils';
import { ItmColumnDef } from './column-def';

@Injectable()
export abstract class AbstractItmCellDirective {
  constructor(
    protected _injector: Injector,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _viewContainerRef: ViewContainerRef
  ) { }

  /** Create the component in the MatTableCell */
  protected _createCellComponent(component: ComponentType, providers: StaticProvider[] = []): void {
    const injector = Injector.create(providers, this._injector);
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);
    this._viewContainerRef.clear();
    this._viewContainerRef.createComponent(componentFactory, null, injector);
  }
}

@Injectable()
export abstract class AbstractItmCellWithColumnDirective extends AbstractItmCellDirective {
  /** The column of the cell. */
  @Input()
  column: ItmColumnDef;

  /** Create the component in the MatTableCell */
  protected _createCellComponent(component: ComponentType, providers: StaticProvider[] = []): void {
    if (!(this.column instanceof ItmColumnDef)) throw new TypeError('Expected column input');
    providers = [
      {provide: ItmColumnDef, useValue: this.column},
      this.column.providers,
      ...providers
    ];
    super._createCellComponent(component, providers);
  }
}
