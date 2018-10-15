import { InjectionToken } from '@angular/core';
import { Map, RecordOf, Record } from 'immutable';
import { BehaviorSubject } from 'rxjs';

import Area from './area';
import Grid from './grid';
import RecordFactory from './record-factory';

export const ITM_GRID_AREA_TOKEN = new InjectionToken<ItmGridArea>('ITM_GRID_AREA_TOKEN');

// tslint:disable-next-line:max-line-length
export type ItmGridArea<G extends Grid = Grid, A extends Area<T> = Area<T>, T extends Object = {}> = RecordOf<ItmGridArea.Model<G, A, T>>;

export module ItmGridArea {
  // tslint:disable-next-line:max-line-length
  export interface Model<G extends Grid = Grid, A extends Area<T> = Area<T>, T extends Object = {}> {
    target: BehaviorSubject<T>;
    grid: G;
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
  export type Factory<G extends Grid = Grid, A extends Area<T> = Area<T>, T extends Object = T> = RecordFactory<ItmGridArea<G, A, T>>;

  export const factory: Factory = RecordFactory.build({
    selector,
    serializer,
    model: {target: null, grid: null, area: null, position: null}
  });

  export function parseGridAreas<T extends Object = T>(
    areaFactories: Map<string, Area.Factory>,
    grid: Grid, target: BehaviorSubject<T>
  ): Map<string, ItmGridArea<Grid, Area<T>>> {
    return grid.positions.map(position => {
      const area = grid.areas.getIn([position.selector, position.key]);
      // tslint:disable-next-line:max-line-length
      if (!Area.factory.isFactoryRecord(area)) throw new ReferenceError(`Missing area for fragment : '${position.selector}:${position.key}'`);
      const gridAreaFactory: RecordFactory<ItmGridArea<Grid, Area<T>>> = (
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
