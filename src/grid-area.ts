import { InjectionToken } from '@angular/core';
import { Map, RecordOf, Record } from 'immutable';
import { BehaviorSubject } from 'rxjs';

import Area from './area';
import Grid from './grid';
import RecordFactory from './record-factory';

export const ITM_GRID_AREA_TOKEN = new InjectionToken<ItmGridArea>('ITM_GRID_AREA_TOKEN');

// tslint:disable-next-line:max-line-length
export type ItmGridArea<A extends Area<T> = Area<T>, T extends Object = {}> = RecordOf<ItmGridArea.Model<A>>;

export module ItmGridArea {
  export interface Model<A extends Area<T> = Area<T>, T extends Object = {}> {
    target: BehaviorSubject<T>;
    grid: Grid;
    area: A;
    position: RecordOf<Grid.Position>;
  }

  export const serializer = (model: RecordOf<Model>): Model => {
    if (!Grid.factory.isFactoryRecord(model.grid)) throw new TypeError('Expected grid');
    if (!Area.factory.isFactoryRecord(model.area)) throw new TypeError('Expected area');
    if (!Record.isRecord(model.position)) throw new TypeError('Expected position');
    return model;
  };

  export const selector = 'gridArea';

  // tslint:disable-next-line:max-line-length
  export type Factory<A extends Area<T> = Area<T>, T extends Object = T> = RecordFactory<ItmGridArea<A>>;

  export const factory: Factory = RecordFactory.build({
    selector,
    serializer,
    model: {target: null, grid: null, area: null, position: null}
  });

  // tslint:disable-next-line:max-line-length
  export function parseGridAreas<T extends Object = T>(areaFactories: Map<string, Area.Factory>, grid: Grid, target: BehaviorSubject<T>): Map<string, ItmGridArea<Area<T>>> {
    return grid.positions.map(position => {
      const area = grid.areas.getIn([position.selector, position.key]);
      // tslint:disable-next-line:max-line-length
      if (!Area.factory.isFactoryRecord(area)) throw new ReferenceError(`Missing area for fragment : '${position.selector}:${position.key}'`);
      const gridAreaFactory: RecordFactory<ItmGridArea<Area<T>>> = (
        (
          Area.factory.getShared(areaFactories, area)
            .reverse()
            .reduce((acc, shared) => (acc || shared.gridAreaFactory), null)
        ) ||
        factory
      );
      return gridAreaFactory.serialize({grid, area, target, position});
    });
  }
}

export default ItmGridArea;
