import {
  ComponentFactoryResolver,
  Injector,
  ViewContainerRef,
  Input,
  OnChanges,
  Directive
} from '@angular/core';

import { ComponentType } from './utils';
import { StaticProvider } from '@angular/core';

/** Directive used by ItmGridComponent to build grid area. */
@Directive({selector: '[itmArea]'})
// tslint:disable-next-line:max-line-length
export class ItmAreaDirective implements OnChanges {
  /**
   * The reference that contains data needed to create the area component.
   * The view container is cleaned at each changes and a new component is created.
   */
  // tslint:disable-next-line:no-input-rename
  @Input('itmArea')
  areaRef: { comp: ComponentType, providers: StaticProvider[] };

  constructor(
    private _injector: Injector,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _viewContainerRef: ViewContainerRef
  ) { }

  ngOnChanges() {
    this._viewContainerRef.clear();
    if (!this.areaRef || typeof this.areaRef !== 'object') return;
    const {comp, providers} = this.areaRef;
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(comp);
    const injector = Injector.create(providers, this._injector);
    try { this._viewContainerRef.createComponent(componentFactory, null, injector); }
    catch (err) {
      console.error(err);
    }
  }
}

