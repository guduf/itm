import {
  ComponentFactoryResolver,
  Injector,
  ViewContainerRef,
  StaticProvider,
  Input,
  EventEmitter,
  Injectable
} from '@angular/core';

import { ComponentType } from './utils';
import { Itm, Itms, ItmPipe } from './item';
import { ItmActionEvent, ItmActionDef } from './action';
import { ItmTypeDef } from './type';

/** The abstract directive to create area component. */
@Injectable()
export abstract class ItmAreaDirective<T = {}, A extends ItmActionDef<T> = ItmActionDef<T>> {
  /** The emitter of action events. */
  @Input()
  actionEmitter?: EventEmitter<ItmActionEvent<T, A>>;

  constructor(
    protected _injector: Injector,
    protected _componentFactoryResolver: ComponentFactoryResolver,
    protected _viewContainerRef: ViewContainerRef
  ) { }

  /** Create the component in the view container */
  protected _createComponent(component: ComponentType, providers: StaticProvider[] = []
  ): void {
    if (typeof this.actionEmitter !== 'undefined') {
      if (!(this.actionEmitter instanceof EventEmitter))
        throw new TypeError('Expected actionEmitter.');
      providers = [{provide: EventEmitter, useValue: this.actionEmitter}, ...providers];
    }
    const injector = Injector.create(providers, this._injector);
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);
    this._viewContainerRef.clear();
    this._viewContainerRef.createComponent(componentFactory, null, injector);
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

  /** The type definition of the item target. */
  @Input()
  typeDef?: ItmTypeDef<I>;

  /** Create the component in the view container */
  protected _createComponent(
    component: ComponentType,
    providers: StaticProvider[] = []
  ): void {
    if (typeof this.item !== 'undefined') {
      if (!this.item || typeof this.item !== 'object') throw new TypeError('Expected item.');
      providers = [{provide: Itm, useValue: this.item}, ...providers];
    }
    if (typeof this.items !== 'undefined') {
      if (!Array.isArray(this.items)) throw new TypeError('Expected items.');
      providers = [{provide: Itms, useValue: this.items}, ...providers];
    }
    if (typeof this.typeDef !== 'undefined') {
      if (!(this.typeDef instanceof ItmTypeDef)) throw new TypeError('Expected typeDef.');
      providers = [{provide: ItmTypeDef, useValue: this.typeDef}, ...providers];
    }
    super._createComponent(component, providers);
  }
}
