import { Map, RecordOf, Collection, isCollection, List } from 'immutable';

import Area from './area';
import Grid from './grid';
import RecordFactory from './record-factory';
import Type from './type';
import { ComponentType, isComponentType, AbstractRecord } from './utils';

/** The global config for the module */
// tslint:disable-next-line:max-line-length
export abstract class ItmConfig extends AbstractRecord<ItmConfig.Model> implements RecordOf<ItmConfig.Model> {
  /** Records that defines item types. */
  types: Map<string, Type>;

  /** Record factories to build grids. Allows to extend the generic grid model. */
  gridFactories: Map<string, Grid.Factory>;

  /** Record factories to build areas. Allows to extend the generic area model. */
  areaFactories: Map<string, Area.Factory>;

  /** The component displayed in the button area when not specified in its configuration. */
  defaultButtonComp: ComponentType;

  /** The component displayed in the control area when not specified in its configuration. */
  defaultControlComp: ComponentType;

  /** The component displayed in the field area when not specified in its configuration. */
  defaultFieldComp: ComponentType;

  /** The component displayed in the generic area when not specified in its configuration. */
  defaultTextComp: ComponentType;
}

export module ItmConfig {
  export interface ModelConfig {
    defaultButtonComp?: ComponentType;
    defaultControlComp?: ComponentType;
    defaultFieldComp?: ComponentType;
    defaultTextComp?: ComponentType;
    areaFactories?: Collection<any, Area.Factory>;
    gridFactories?: Collection<any, Grid.Factory>;
    types?: List<any> | Map<string, Type>;
  }

  export interface Model extends ModelConfig {
    defaultButtonComp: ComponentType;
    defaultControlComp: ComponentType;
    defaultFieldComp: ComponentType;
    defaultTextComp: ComponentType;
    areaFactories: Map<string, Area.Factory>;
    gridFactories: Map<string, Grid.Factory>;
    types: Map<string, Type>;
  }

  const serializer = (cfg: RecordOf<ModelConfig>): Model => {
    if (!isComponentType(cfg.defaultButtonComp)) throw new TypeError('Expected ComponentType');
    const defaultButtonComp = cfg.defaultButtonComp;

    if (!isComponentType(cfg.defaultControlComp)) throw new TypeError('Expected ComponentType');
    const defaultControlComp = cfg.defaultControlComp;

    if (!isComponentType(cfg.defaultFieldComp)) throw new TypeError('Expected ComponentType');
    const defaultFieldComp = cfg.defaultFieldComp;

    if (!isComponentType(cfg.defaultTextComp)) throw new TypeError('Expected ComponentType');
    const defaultTextComp = cfg.defaultTextComp;

    if (
      !isCollection(cfg.areaFactories) ||
      cfg.areaFactories.reduce(
        (isNotFact, fact) => isNotFact || !(fact instanceof RecordFactory),
        false
      )
    ) throw new TypeError('Expected Map of Area factory');
    const areaFactories: Map<string, Area.Factory> = (
      cfg.areaFactories.reduce((acc, fact) => acc.set(fact.selector, fact), Map())
    );

    if (
      !isCollection(cfg.gridFactories) ||
      cfg.gridFactories.reduce(
        (isNotFact, fact) => isNotFact || !(fact instanceof RecordFactory),
        false
      )
    ) throw new TypeError('Expected Map of Grid factory');
    const gridFactories: Map<string, Grid.Factory> = (
      cfg.gridFactories.reduce((acc, fact) => acc.set(fact.selector, fact), Map())
    );

    if (!isCollection(cfg.types)) throw new TypeError('Expected Map of Types config');
    const types: Map<string, Type> = (
      Map.isMap(cfg.types) ? cfg.types :
        cfg.types.reduce(
          (acc, typeCtor) => {
            const record = Type.get(typeCtor);
            // tslint:disable-next-line:max-line-length
            if (!Type.factory.isFactoryRecord(record)) throw new TypeError('Expected ItmType record');
            return acc.set(record.key, record);
          },
          Map()
        )
    );

    return {
      defaultButtonComp,
      defaultControlComp,
      defaultFieldComp,
      defaultTextComp,
      areaFactories,
      gridFactories,
      types
    };
  };

  const selector = 'config';

  export const factory: RecordFactory<ItmConfig, ModelConfig, Model> = RecordFactory.build({
    selector,
    serializer,
    model: {
      defaultButtonComp: null,
      defaultControlComp: null,
      defaultFieldComp: null,
      defaultTextComp: null,
      gridFactories: null,
      areaFactories: null,
      types: null
    }
  });
}

export default ItmConfig;
