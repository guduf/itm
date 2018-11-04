
import { Map, RecordOf } from 'immutable';
import { empty } from 'rxjs';

import Area from './area';
import ItmConfig from './config';
import RecordFactory from './record_factory';
import Target from './target';
import { ComponentType, isComponentType } from './utils';

// tslint:disable-next-line:max-line-length
export type ItmAreaFactory<R extends RecordOf<Area.Model> = Area , C extends Area.Config = Area.Config> = RecordFactory<R, C, any, ItmAreaFactory.Shared>;

export function ItmAreaFactory(): ItmAreaFactory;
export function ItmAreaFactory(...cfgs: Partial<Area.Config>[]): Area;
// tslint:disable-next-line:max-line-length
export function ItmAreaFactory(...cfgs: Partial<Area.Config>[]): Area | ItmAreaFactory {
  if (!cfgs.length) return ItmAreaFactory._static;
  return ItmAreaFactory._static.serialize(...cfgs);
}

export module ItmAreaFactory {
  // tslint:disable-next-line:max-line-length
  export class Shared<A extends Area<T> = Area<T>, T extends Object = {}> {
    readonly defaultComp?: (cfg: ItmConfig) => ComponentType;

    readonly defaultText?: Target.Pipe<{ area: A, target: T }, string>;

    readonly providers?: Map<any, Area.Provider>;

    constructor(shared: Shared) { Object.assign(this, shared); }
  }

  export function normalize(cfg: Area.Config): Area.Model {
    if (!cfg.key || !Area.keyRegExp.test(cfg.key)) throw new TypeError('Expected key');
    const key = cfg.key;
    const comp = cfg.comp !== false && isComponentType(cfg.comp) ? cfg.comp as ComponentType : null;
    const text: Target.Pipe<{}, string> = (
      cfg.text === false ? () => empty() :
      cfg.text ? Target.defer('string', cfg.text) :
        null
    );
    const sizeCfg: Partial<Area.Size> = (
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
    const size = Area.sizeFactory({width, flexWidth, height, flexHeight});
    return {key, comp, text, size};
  }


  export const _static: ItmAreaFactory = RecordFactory.build({
    selector: Area.selector,
    normalize,
    model: {key: null, comp: null, text: null, size: null},
    shared: new Shared({})
  });
}

export default ItmAreaFactory;
