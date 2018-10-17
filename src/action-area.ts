import Action from './action';
import RecordFactory from './record-factory';
import Area from './area';
import { ItmActionAreaComponent } from './action-area.component';

export type ItmActionArea<T extends Object = {}> = Area<T> & Action<T>;

export module ItmActionArea {
  export const selector = 'action';

  export type Config<T extends Object = {}> = Action.Config<T> & Area.Config<T>;

  export const factory: Area.Factory<ItmActionArea, Config> = RecordFactory.build({
    selector: 'actionArea',
    shared: new Area.Shared({
      defaultComp: ItmActionAreaComponent
    }),
    ancestors: [Area.factory, Action.factory]
  });
}

export default ItmActionArea;
