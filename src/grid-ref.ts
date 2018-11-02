import { Injector, InjectionToken, StaticProvider } from '@angular/core';
import { Map } from 'immutable';
import { Observable, combineLatest, defer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import Action from './action';
import ActionEmitter from './action-emitter';
import Area, { ItmAreaText } from './area';
import ItmConfig from './config';
import Grid, { ItmGrid } from './grid';
import Template from './grid-template';
import Target from './target';
import { ComponentType } from './utils';


export interface ItmGridRef {
  grid: Grid;
  emitter: ActionEmitter;
  areas: Map<Template.Fragment, ItmGridRef.AreaRef>;
}

export module ItmGridRef {
  export interface AreaRef {
    area: Area;
    comp: ComponentType;
    position: Template.Position;
    injector: Injector;
  }

  export function buildRef(
    injector: Injector,
    grid: ItmGrid,
    target: Target,
    resolvers: Observable<Action.Resolvers>
  ): ItmGridRef {
    const config = injector.get(ItmConfig) as ItmConfig;
    const gridFactories = config.gridFactories as Map<string, ItmGrid.Factory<any>>;
    const shared = Grid.factory.getShared(gridFactories, grid).reduce(
      (acc, val) => ({
        defaultSelector: val.defaultSelector || acc.defaultSelector,
        providers: acc.providers.merge(val.providers),
        resolversProvider: val.resolversProvider || acc.resolversProvider
      }),
      {defaultSelector: null, providers: Map(), resolversProvider: null} as Partial<Grid.Shared>
    );
    const sharedResolversToken = new InjectionToken('ITM_SHARED_RESOLVERS_TOKEN');
    const emitterProviders: StaticProvider[] = (
      !shared.resolversProvider ?
        [{provide: ActionEmitter, useValue: new ActionEmitter(target, resolvers)}] :
        [
          {provide: sharedResolversToken, ...shared.resolversProvider},
          {
            provide: ActionEmitter,
            deps: [sharedResolversToken],
            useFactory: (sharedResolvers: Observable<Action.Resolvers>) => new ActionEmitter(
              target,
              combineLatest(sharedResolvers, resolvers).pipe(map(e => e[0].merge(e[1])))
            )
          }
        ]
    );
    const providers = [
      {provide: ItmGrid, useValue: grid},
      {provide: Target, useValue: target},
      ...shared.providers.reduce((acc, prvdr, provide) => ([...acc, {provide, ...prvdr}]), []),
      ...emitterProviders
    ];
    const gridInjector = Injector.create(providers, injector);
    const areas = buildAreaRefs(gridInjector);
    return {grid, areas, emitter: gridInjector.get(ActionEmitter)};
  }

  export function buildAreaRefs(gridInjector: Injector): Map<Template.Fragment, AreaRef> {
    let inj: { config: ItmConfig, grid: ItmGrid, target: Target };
    try {
      inj = {
        config:  gridInjector.get(ItmConfig),
        grid: gridInjector.get(ItmGrid),
        target: gridInjector.get(Target)
      };
    }
    catch (err) { throw new ReferenceError('Excepted Grid Injector'); }
    return inj.grid.positions.map(position => {
      const area: Area = inj.grid.areas.getIn([position.selector, position.key]);
      // tslint:disable-next-line:max-line-length
      if (!Area.factory.isFactoryRecord(area)) throw new ReferenceError(`Missing area for fragment : '${position.selector}:${position.key}'`);
      const areaFactories = inj.config.areaFactories as Map<string, Area.Factory<any>>;
      const areaShared = Area.factory.getShared(areaFactories, area).reduce<Area.Shared>(
        (acc, {defaultComp, defaultText, providers: areaProviders}) => ({
          defaultComp: defaultComp || acc.defaultComp,
          defaultText: defaultText || acc.defaultText,
          providers: acc.providers.merge(areaProviders)
        }),
        {defaultComp: null, defaultText: null, providers: Map<any, Area.Provider>()}
      );
      const comp = (
        area.comp ||
        typeof areaShared.defaultComp === 'function' ? areaShared.defaultComp(inj.config) :
        null
      );
      const areaText = defer(() => (
        area.text ? Target.map(inj.target, area.text) : inj.target.pipe(
          map(value => areaShared.defaultText({area, target: value}))
        )
      ));
      const providers: StaticProvider[] = areaShared.providers.reduce(
        (acc, prvdr, provide) => ([...acc, {provide, ...prvdr}]),
        [
          {provide: Area, useValue: area},
          {provide: ItmAreaText, useValue: areaText}
        ]
      );
      const injector = Injector.create(providers, gridInjector);
      return {area, comp, position, injector};
    });
  }
}

export default ItmGridRef;
