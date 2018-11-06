
import Options from './options';
import RecordFactory from './record_factory';

export function ItmOptionsFactory(): RecordFactory<Options, Options.Config>;
export function ItmOptionsFactory(...cfgs: Partial<Options.Config>[]): Options;
// tslint:disable-next-line:max-line-length
export function ItmOptionsFactory(...cfgs: Partial<Options.Config>[]): Options | RecordFactory<Options, Options.Config> {
  if (!cfgs.length) return ItmOptionsFactory._static;
  return ItmOptionsFactory._static.serialize(...cfgs);
}

export module ItmOptionsFactory {
  export function normalize(cfg: Options.Config): Options.Model {
    if (typeof cfg.defaultButtonComp !== 'function') throw new TypeError('Expected ComponentType');
    const defaultButtonComp = cfg.defaultButtonComp;

    if (typeof cfg.defaultControlComp !== 'function') throw new TypeError('Expected ComponentType');
    const defaultControlComp = cfg.defaultControlComp;

    if (typeof cfg.defaultFieldComp !== 'function') throw new TypeError('Expected ComponentType');
    const defaultFieldComp = cfg.defaultFieldComp;

    if (typeof cfg.defaultMenuComp !== 'function') throw new TypeError('Expected ComponentType');
    const defaultMenuComp = cfg.defaultMenuComp;

    return {
      defaultButtonComp,
      defaultControlComp,
      defaultFieldComp,
      defaultMenuComp
    };
  }

  // tslint:disable-next-line:max-line-length
  export const _static: RecordFactory<Options, Options.Config, Options.Model> = RecordFactory.build({
    selector: Options.selector,
    normalize,
    model: {
      defaultButtonComp: null,
      defaultControlComp: null,
      defaultFieldComp: null,
      defaultMenuComp: null
    }
  });
}

export default ItmOptionsFactory;
