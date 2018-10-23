
import { Map, RecordOf } from 'immutable';
import { Observable, of, empty } from 'rxjs';

import ItmConfig from './config';
import RecordFactory from './record-factory';
import Target from './target';
import { ComponentType, isComponentType, AbstractRecord } from './utils';

/** Provide the area text. */
export abstract class ItmAreaText extends Observable<string> { }

/** Record that describes the properties of an generic area displayed in a grid. */
// tslint:disable-next-line:max-line-length
export abstract class ItmArea<T extends Object = {}> extends AbstractRecord<ItmArea.Model> implements RecordOf<ItmArea.Model> {
  readonly key: string;
  readonly comp: ComponentType | null;
  readonly text: Target.Pipe<T, string> | null;
}

export module ItmArea {
  export interface Config<T = {}> {
    /** The identifier of the area. Must be unique in each selector context. */
    key: string;

    /** The text attached to the area. Can be injected by area components as ItmAreaText. */
    text?: Target.PipeLike<T, string> | false;

    /**
     * The component displayed in the area.
     * A default component could be determined the area factory and the config.
     */
    comp?: ComponentType | false;
  }

  export interface Model<T = {}> extends  Config<T> {
    key: string;
    comp: ComponentType | null;
    text: Target.Pipe<T, string> | null;
  }

  export type Provider = (
    { useValue: any } |
    { useFactory: Function, deps: any[] } |
    { useClass: any }
  );

  // tslint:disable-next-line:max-line-length
  export class Shared {
    readonly defaultComp?: (cfg: ItmConfig) => ComponentType;

    readonly providers?: Map<any, Provider>;

    constructor(shared: Shared) { Object.assign(this, shared); }
  }

  // tslint:disable-next-line:max-line-length
  export type Factory<R extends RecordOf<Model> = ItmArea , C extends ItmArea.Config = ItmArea.Config> = RecordFactory<R, C, any, Shared>;

  const selector = 'area';

  const serializer = (cfg: RecordOf<Config>): Model => {
    if (!cfg.key || !keyRegExp.test(cfg.key)) throw new TypeError('Expected key');
    const key = cfg.key;
    const comp = cfg.comp !== false && isComponentType(cfg.comp) ? cfg.comp as ComponentType : null;
    const text: Target.Pipe<{}, string> = (
      cfg.text === false ? () => empty() : Target.defer('string', cfg.text)
    );
    return {key, comp, text};
  };

  const areaTextProvider: Provider = {
    deps: [ItmArea, Target],
    useFactory: (area: ItmArea, target: Target): ItmAreaText => (
      Target.map(target, area.text || (() => of(area.key)))
    )
  };

  export const factory: Factory = RecordFactory.build({
    selector,
    serializer,
    model: {key: null, comp: null, text: null},
    shared: new Shared({
      providers: Map<any, Provider>().set(ItmAreaText, areaTextProvider)
    })
  });

  export const defaultKey = '$default';
  export const keyPattern = `\\$?${RecordFactory.selectorPattern}`;
  export const keyRegExp = new RegExp(`^${keyPattern}$`);
}

export default ItmArea;
