import {
  ComponentFactoryResolver,
  Injector,
  ViewContainerRef,
  StaticProvider,
  Input,
  EventEmitter,
  OnInit,
  Directive,
  Inject,
  InjectionToken
} from '@angular/core';
import { Map } from 'immutable';

import Action from './action';
import ActionEvent from './action-event';
import Area from './area';
import { ItmConfig } from './config';
import { ITM_TARGET } from './item';
import { ComponentType } from './utils';

/** The abstract directive to create area component. */
@Directive({selector: '[itmArea]'})
// tslint:disable-next-line:max-line-length
export class ItmAreaDirective<T = {}, A extends Action = Action<T>> implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('itmArea')
  area: Area;

  /** The emitter of action events. */
  @Input()
  action: ActionEvent.Emitter<T, A>;

  @Input()
  target: T;

  @Input()
  providers: StaticProvider[];

  constructor(
    private _injector: Injector,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _viewContainerRef: ViewContainerRef,
    @Inject(Area.FACTORY_MAP_TOKEN)
    private _areaFactories: Map<string, Area.Factory<Area<T>>>
  ) { }

  ngOnInit() {
    if (!Area.factory.isFactoryRecord(this.area)) throw new TypeError('Expected area');
    if (typeof this.target !== 'object') throw new TypeError('Expected target');
    if (!(this.action instanceof EventEmitter)) throw new TypeError('Expected action');

    const shared = Area.factory.getShared(this._areaFactories, this.area);

    const factoriesProviders = shared
      .reduce<Map<InjectionToken<any>, any>>(
        (acc, {provide}) => (provide ? acc.merge(provide(this.area, this.target)) : acc),
        Map()
      )
      .map((value, token) => ({provide: token, useValue: value}))
      .valueSeq()
      .toArray();

      const comp = (
      this.area.cell ||
      shared.reverse().reduce<ComponentType>((acc, {defaultComp}) => (acc || defaultComp), null) ||
      this._injector.get(ItmConfig).defaultTextAreaComp
    );

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(comp);

    const providers = [
      ...(Array.isArray(this.providers) ? this.providers : []),
      {provide: Area.RECORD_TOKEN, useValue: this.area},
      {provide: ITM_TARGET, useValue: this.target},
      {provide: ActionEvent.EMITTER_TOKEN, useValue: this.action},
      ...factoriesProviders
    ];
    const injector = Injector.create(providers, this._injector);

    this._viewContainerRef.createComponent(componentFactory, null, injector);
  }
}
