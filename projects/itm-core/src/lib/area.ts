
import {
  FactorySansProvider,
  ValueSansProvider,
  StaticClassSansProvider
} from '@angular/core/src/di/provider';
import { Map, Record, RecordOf } from 'immutable';
import { Observable, empty } from 'rxjs';

import ItmConfig from './config';
import RecordFactory from './record_factory';
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
  readonly size: RecordOf<ItmArea.Size>;
}

export module ItmArea {
  export interface Config<T = {}> {
    /** The identifier of the area. Must be unique in each selector context. */
    key: string;

    /** The text attached to the area. Can be injected by area components as ItmAreaText. */
    text?: Target.PipeLike<T, string> | false;

    /** The fraction of the available grid space occupied by the area. */
    size?: [number | [number, number], number | [number, number]] | Partial<Size>;

    /**
     * The component displayed in the area.
     * A default component could be determined the area factory and the config.
     */
    comp?: ComponentType | false;
  }

  export interface Size {
    width: number;
    flexWidth: number;
    height: number;
    flexHeight: number;
  }

  // tslint:disable-next-line:max-line-length
  export const sizeFactory = Record<Size>({width: null, flexWidth: null, height: null, flexHeight: null});

  export interface Model<T = {}> extends Config<T> {
    key: string;
    comp: ComponentType | null;
    text: Target.Pipe<T, string> | null;
    size: RecordOf<Size>;
  }

  export type Provider = ValueSansProvider | FactorySansProvider | StaticClassSansProvider;

  export type Providers = Map<any, Provider>;

  // tslint:disable-next-line:max-line-length
  export class Shared<A extends ItmArea<T> = ItmArea<T>, T extends Object = {}> {
    readonly defaultComp?: (cfg: ItmConfig) => ComponentType;

    readonly defaultText?: Target.Pipe<{ area: A, target: T }, string>;

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
      cfg.text === false ? () => empty() :
      cfg.text ? Target.defer('string', cfg.text) :
        null
    );
    const sizeCfg: Partial<Size> = (
      !cfg.size || typeof cfg.size !== 'object' ? {} :
      !Array.isArray(cfg.size) ? cfg.size :
        ({
          width: cfg.size[0] ? Array.isArray(cfg.size[0]) ? cfg.size[0][0] : cfg.size[0] : null,
          flexWidth: Array.isArray(cfg.size[0]) && cfg.size[0][1] ? cfg.size[0][1] : null,
          height: cfg.size[1] ? Array.isArray(cfg.size[1]) ? cfg.size[1][0] : cfg.size[1] : null,
          flexHeight: Array.isArray(cfg.size[1]) &&  cfg.size[1][1] ? cfg.size[1][1] : null
        })
    );
    const width = sizeCfg.width >= 1 ? Math.round(sizeCfg.width) : 3;
    const flexWidth = (
      sizeCfg.flexWidth !== null && sizeCfg.flexWidth >= 0 ?
        Math.round(sizeCfg.flexWidth * 10e8) / 10e8 :
        0
    );
    const height = sizeCfg.height >= 1 ? Math.round(sizeCfg.height) : 1;
    const flexHeight = (
      sizeCfg.flexHeight !== null && sizeCfg.flexHeight >= 0 ?
        Math.round(sizeCfg.flexHeight * 10e8) / 10e8 :
        0
    );
    const size = sizeFactory({width, flexWidth, height, flexHeight});
    return {key, comp, text, size};
  };

  export const factory: Factory = RecordFactory.build({
    selector,
    serializer,
    model: {key: null, comp: null, text: null, size: null},
    shared: new Shared({})
  });

  export const defaultKey = '$default';
  export const keyPattern = `\\$?${RecordFactory.selectorPattern}`;
  export const keyRegExp = new RegExp(`^${keyPattern}$`);
}

export default ItmArea;
