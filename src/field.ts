
import { Map, RecordOf } from 'immutable';
import { Observable, of, empty } from 'rxjs';

import Area from './area';
import Target from './target';

export abstract class ItmFieldLabel extends Observable<string> { }

export type ItmField<T extends Object = {}> = Area<T> & RecordOf<ItmField.Model<T>>;

export module ItmField {
  export interface ModelConfig<T extends Object = {}> {
    label?: Target.PipeLike<T, string> | false;
  }

  export interface Model<T extends Object = {}> extends ModelConfig<T> {
    label: Target.Pipe<T, string> | null;
  }

  const serializer = (cfg: RecordOf<ModelConfig>, area: Area): Model => {
    const label = (
      cfg.label === false ? () => empty() : Target.defer('string', cfg.label)
    );
    return {label};
  };

  export const selector = 'field';

  export type Config<T extends Object = {}> = Area.Config<T> & ModelConfig<T>;

  const fieldLabelProvider: Area.Provider = {
    deps: [Area, Target],
    useFactory: (area: ItmField, target: Target): ItmFieldLabel => (
      Target.map(target, area.label || (() => of(area.key)))
    )
  };

  export const factory: Area.Factory<ItmField, Config> = Area.factory.extend({
    selector,
    serializer,
    model: {label: null},
    shared: new Area.Shared({
      defaultComp: cfg => cfg.defaultFieldComp,
      providers: Map<any, Area.Provider>()
        .set(ItmFieldLabel, fieldLabelProvider)
    })
  });
}

export default ItmField;
