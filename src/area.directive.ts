import {
  ComponentFactoryResolver,
  Injector,
  ViewContainerRef,
  StaticProvider,
  Input,
  EventEmitter,
  ComponentRef,
  OnInit,
  Directive
} from '@angular/core';

import { ITM_TARGET } from './item';
import { ItmActionEvent, ItmAction, ItmActionEmitter } from './action';
import ItmArea from './area';
import { ItmConfig } from './config';

/** The abstract directive to create area component. */
@Directive({selector: '[itmArea]'})
// tslint:disable-next-line:max-line-length
export class ItmAreaDirective<T = {}, A extends ItmAction = ItmAction<T>> implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('itmArea')
  area: ItmArea.Record;

  /** The emitter of action events. */
  @Input()
  action: ItmActionEmitter<ItmActionEvent<T, A>>;

  @Input()
  target: T;

  @Input()
  providers: StaticProvider[];

  protected _componentRef: ComponentRef<any>;

  constructor(
    protected _injector: Injector,
    protected _componentFactoryResolver: ComponentFactoryResolver,
    protected _viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit() {
    if (ItmArea.factory.isFactoryRecord(this.area)) throw new TypeError('Expected area');
    if (typeof this.target !== 'object') throw new TypeError('Expected target');
    if (!(this.action instanceof EventEmitter)) throw new TypeError('Expected action');
    const providers = [
      ...(Array.isArray(this.providers) ? this.providers : []),
      {provide: ItmActionEmitter, useValue: this.action},
      {provide: ItmArea, useValue: this.area},
      {provide: ITM_TARGET, useValue: this.target},
      this.area.providers
        .map((useValue, provide) => ({provide, useValue} as StaticProvider))
        .toArray()
    ];
    const injector = Injector.create(providers, this._injector);
    const component = (
      this.area.cell || this._injector.get(ItmConfig).defaultTextAreaComp
    );
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);
    this._viewContainerRef.clear();
    this._componentRef = this._viewContainerRef.createComponent(componentFactory, null, injector);
  }
}
