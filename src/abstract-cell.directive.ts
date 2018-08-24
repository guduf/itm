import {
  Injectable,
  OnInit,
  ComponentFactoryResolver,
  Injector,
  ViewContainerRef,
  StaticProvider,
  Input
} from '@angular/core';

import { ItmColumnDef } from './column-def';
import { ItmConfig } from './itm-config';
import { ComponentType } from './utils';

@Injectable()
export abstract class AbstractItmCellDirective implements OnInit {
  /** The column of the cell. */
  @Input()
  column: ItmColumnDef;

  constructor(
    protected _config: ItmConfig,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _injector: Injector,
    private _viewContainerRef: ViewContainerRef
  ) { }

  abstract ngOnInit();
  /** Create the component in the MatTableCell */
  protected _createCellComponent(component: ComponentType, providers: StaticProvider[] = []): void {
    if (!(this.column instanceof ItmColumnDef)) throw new TypeError('Expected column input');
    providers = [...  providers, {provide: ItmColumnDef, useValue: this.column}];
    console.log(providers);
    const injector = Injector.create(providers, this._injector);
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);
    this._viewContainerRef.clear();
    this._viewContainerRef.createComponent(componentFactory, null, injector);
  }
}
