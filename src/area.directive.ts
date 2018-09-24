import {
  ComponentFactoryResolver,
  Injector,
  ViewContainerRef,
  StaticProvider,
  Input,
  EventEmitter,
  Injectable,
  ComponentRef
} from '@angular/core';

import { ComponentType } from './utils';
import { Itm, Itms, ItmPipe, ItmsChanges, ItmTarget } from './item';
import { ItmActionEvent, ItmActionDef } from './action';
import { ItmTypeDef } from './type';
import { ItmAreaDef, ItmPropAreaDef } from './area-def';
import { Observable } from 'rxjs';

/** The abstract directive to create area component. */
@Injectable()
export abstract class ItmAreaDirective<T = {}, A extends ItmActionDef<T> = ItmActionDef<T>> {
  @Input()
  area: ItmAreaDef;

  /** The emitter of action events. */
  @Input()
  action: EventEmitter<ItmActionEvent<T, A>>;

  @Input()
  target: T;

  protected _componentRef: ComponentRef<any>;

  constructor(
    protected _injector: Injector,
    protected _componentFactoryResolver: ComponentFactoryResolver,
    protected _viewContainerRef: ViewContainerRef
  ) { }

  /** Create the component in the view container */
  protected _createComponent(component: ComponentType, providers: StaticProvider[] = []): void {
      // tslint:disable-next-line:max-line-length
      if (typeof this.target !== 'object') throw new TypeError('Expected target.');
      providers = [...providers, {provide: ItmTarget, useValue: this.target}];
      // tslint:disable-next-line:max-line-length
      if (!(this.action instanceof EventEmitter)) throw new TypeError('Expected action.');
      providers = [...providers, {provide: EventEmitter, useValue: this.action}];
      if (!(this.area instanceof ItmAreaDef)) throw new TypeError('Expected area.');
      providers = [
        ...providers,
        {provide: ItmAreaDef, useValue: this.area},
        ...(this.area ? this.area.getProviders(this.target) : [])
      ];
    const injector = Injector.create(providers, this._injector);
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);
    this._viewContainerRef.clear();
    this._componentRef = this._viewContainerRef.createComponent(componentFactory, null, injector);
  }
}

@Injectable()
/** The abstract directive to create area component with a typed item. */
export abstract class ItmTypedAreaDirective<
  I extends Itm = Itm,
  II extends (I | I[]) = I,
  A extends ItmActionDef<II> = ItmActionDef<II>
> extends ItmAreaDirective<II, A> {
  /** The item target of the area */
  @Input()
  item?: I;

  /** The collection where come from the item target. */
  @Input()
  items?: I[];

  @Input()
  itemsChanges: ItmsChanges<I>;

  /** Create the component in the view container */
  protected _createComponent(
    component: ComponentType,
    providers: StaticProvider[] = []
  ): void {
    if (!(this.area instanceof ItmPropAreaDef)) throw new TypeError('Expected ItmPropAreaDef.');
    providers = [
      ...providers,
      {provide: ItmPropAreaDef, useValue: this.area},
      {provide: ItmTarget, useValue: this.target}
    ];
    if (typeof this.item !== 'undefined') {
      if (!this.item || typeof this.item !== 'object') throw new TypeError('Expected item.');
      providers = [ ...providers, {provide: Itm, useValue: this.item},];
    }
    if (typeof this.items !== 'undefined') {
      if (!Array.isArray(this.items)) throw new TypeError('Expected items.');
      providers = [...providers, {provide: Itms, useValue: this.items}];
    }
    if (typeof this.itemsChanges !== 'undefined') {
      if (!(this.itemsChanges instanceof Observable)) throw new TypeError('Expected itemsChanges.');
      providers = [...providers, {provide: ItmsChanges, useValue: this.itemsChanges}];
    }
    this.target = this.target || (this.item as II) || (this.items as II);
    super._createComponent(component, providers);
  }
}
