import {
  ComponentFactoryResolver,
  Injector,
  ViewContainerRef,
  Input,
  OnChanges,
  Directive
} from '@angular/core';

import Grid from './grid';

/** The abstract directive to create area component. */
@Directive({selector: '[itmArea]'})
// tslint:disable-next-line:max-line-length
export class ItmAreaDirective implements OnChanges {
  // tslint:disable-next-line:no-input-rename
  @Input('itmArea')
  areaRef: Grid.AreaRef;

  constructor(
    private _injector: Injector,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _viewContainerRef: ViewContainerRef
  ) { }

  ngOnChanges() {
    this._viewContainerRef.clear();
    const {comp, providers} = this.areaRef;
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(comp);
    const injector = Injector.create(providers, this._injector);
    try { this._viewContainerRef.createComponent(componentFactory, null, injector); }
    catch (err) {
      console.error(err);
    }
  }
}

