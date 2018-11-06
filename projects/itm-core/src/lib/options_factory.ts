import { Map, isCollection } from 'immutable';

import Options from './options';
import RecordFactory from './record_factory';
import Type from './type';
import TypeDecorator from './type_decorator';
import TypeFactory from './type_factory';

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

    if (
      !isCollection(cfg.areaFactories) ||
      cfg.areaFactories.reduce(
        (isNotFact, fact) => isNotFact || !(fact instanceof RecordFactory),
        false
      )
    ) throw new TypeError('Expected Map of Area factory');
    const areaFactories: Map<string, RecordFactory> = (
      cfg.areaFactories.reduce((acc, fact) => acc.set(fact.selector, fact), Map())
    );

    if (
      !isCollection(cfg.gridFactories) ||
      cfg.gridFactories.reduce(
        (isNotFact, fact) => isNotFact || !(fact instanceof RecordFactory),
        false
      )
    ) throw new TypeError('Expected Map of Grid factory');
    const gridFactories: Map<string, RecordFactory> = (
      cfg.gridFactories.reduce((acc, fact) => acc.set(fact.selector, fact), Map())
    );

    if (!isCollection(cfg.types)) throw new TypeError('Expected Map of Types options');
    const types: Map<string, Type> = (
      Map.isMap(cfg.types) ? cfg.types :
        cfg.types.reduce(
          (acc, typeCtor) => {
            const record = TypeDecorator.get(typeCtor);
            // tslint:disable-next-line:max-line-length
            if (!TypeFactory().isFactoryRecord(record)) throw new TypeError('Expected ItmType record');
            return acc.set(record.key, record);
          },
          Map()
        )
    );

    return {
      defaultButtonComp,
      defaultControlComp,
      defaultFieldComp,
      defaultMenuComp,
      areaFactories,
      gridFactories,
      types
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
      defaultMenuComp: null,
      gridFactories: null,
      areaFactories: null,
      types: null
    }
  });
}

export default ItmOptionsFactory;
