import { Injector, InjectionToken, StaticProvider } from '@angular/core';
import { Map } from 'immutable';
import { defer, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import Area, { ItmAreaText } from './area';
import AreaFactory from './area_factory';
import ActionEmitter from './action_emitter';
import Options from './options';
import Grid, { ItmGrid } from './grid';
import GridFactory from './grid_factory';
import Template from './grid_template';
import Target from './target';
import { ComponentType } from './utils';

export const ITM_SHARED_RESOLVERS_TOKEN = new InjectionToken('ITM_SHARED_RESOLVERS_TOKEN');

export interface ItmGridRef {
  record: Grid;
  injector: Injector;
  areas: Map<Template.Fragment, ItmGridRef.AreaRef>;
}

export module ItmGridRef {
  export interface AreaRef {
    record: Area;
    comp: ComponentType;
    position: Template.Position;
    injector: Injector;
  }

  export function buildRef(
    opts: Options,
    record: ItmGrid,
    target: Target,
    actionEmitter: ActionEmitter
  ): ItmGridRef {
    const gridFactories = opts.gridFactories as Map<string, GridFactory<any>>;
    const shared = GridFactory().getShared(gridFactories, record).reduce(
      (acc, val) => ({
        defaultSelector: val.defaultSelector || acc.defaultSelector,
        providers: acc.providers.merge(val.providers),
        resolversProvider: val.resolversProvider || acc.resolversProvider
      }),
      // tslint:disable-next-line:max-line-length
      {defaultSelector: null, providers: Map(), resolversProvider: null} as Partial<GridFactory.Shared>
    );
    const providers = [
      {provide: Options, useValue: opts},
      {provide: ItmGrid, useValue: record},
      {provide: ActionEmitter, useValue: actionEmitter},
      {provide: Target, useValue: target},
      ...shared.providers.reduce((acc, prvdr, provide) => ([...acc, {provide, ...prvdr}]), []),
      {
        provide: ITM_SHARED_RESOLVERS_TOKEN,
        ...(shared.resolversProvider ? shared.resolversProvider : {useValue: of(Map())})
      }
    ];
    const injector = Injector.create(providers);
    const areas = buildAreaRefs(injector);
    return {record, injector, areas};
  }

  export function buildAreaRefs(gridInjector: Injector): Map<Template.Fragment, AreaRef> {
    let inj: { opts: Options, grid: ItmGrid, target: Target };
    try {
      inj = {
        opts: gridInjector.get(Options),
        grid: gridInjector.get(ItmGrid),
        target: gridInjector.get(Target)
      };
    }
    catch (err) { throw new ReferenceError('Excepted Grid Injector'); }
    return inj.grid.positions.map(position => {
      const record: Area = inj.grid.areas.getIn([position.selector, position.key]);
      // tslint:disable-next-line:max-line-length
      if (!AreaFactory().isFactoryRecord(record)) throw new ReferenceError(`Missing record for fragment : '${position.selector}:${position.key}'`);
      const areaFactories = inj.opts.areaFactories as Map<string, AreaFactory<any>>;
      const areaShared = AreaFactory().getShared(areaFactories, record).reduce<AreaFactory.Shared>(
        (acc, {defaultComp, defaultText, providers: areaProviders}) => ({
          defaultComp: defaultComp || acc.defaultComp,
          defaultText: defaultText || acc.defaultText,
          providers: acc.providers.merge(areaProviders)
        }),
        {defaultComp: null, defaultText: null, providers: Map<any, Area.Provider>()}
      );
      const comp = (
        record.comp ||
        typeof areaShared.defaultComp === 'function' ? areaShared.defaultComp(inj.opts) :
        null
      );
      const areaText = defer(() => (
        record.text ? Target.map(inj.target, record.text) :
          inj.target.pipe(
            mergeMap(value => areaShared.defaultText({area: record, target: value}))
          )
      ));
      const providers: StaticProvider[] = areaShared.providers.reduce(
        (acc, prvdr, provide) => ([...acc, {provide, ...prvdr}]),
        [
          {provide: Area, useValue: record},
          {provide: ItmAreaText, useValue: areaText}
        ]
      );
      const injector = Injector.create(providers, gridInjector);
      return {record, comp, position, injector};
    });
  }
}

export default ItmGridRef;
