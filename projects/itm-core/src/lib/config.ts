import { Map, RecordOf, Collection, List } from 'immutable';

import RecordFactory from './record_factory';
import Type from './type';
import { ComponentType, AbstractRecord } from './utils';

/** The global config for the module */
// tslint:disable-next-line:max-line-length
export abstract class ItmConfig extends AbstractRecord<ItmConfig.Model> implements RecordOf<ItmConfig.Model> {
  /** Records that defines item types. */
  types: Map<string, Type>;

  /** Record factories to build grids. Allows to extend the generic grid model. */
  gridFactories: Map<string, RecordFactory>;

  /** Record factories to build areas. Allows to extend the generic area model. */
  areaFactories: Map<string, RecordFactory>;

  /** The component displayed in the button area when not specified in its configuration. */
  defaultButtonComp: ComponentType;

  /** The component displayed in the control area when not specified in its configuration. */
  defaultControlComp: ComponentType;

  /** The component displayed in the field area when not specified in its configuration. */
  defaultFieldComp: ComponentType;

  /** The component displayed in the menu area when not specified in its configuration. */
  defaultMenuComp: ComponentType;
}

export module ItmConfig {
  export interface ModelConfig {
    defaultButtonComp?: ComponentType;
    defaultControlComp?: ComponentType;
    defaultFieldComp?: ComponentType;
    defaultMenuComp?: ComponentType;
    areaFactories?: Collection<any, RecordFactory<any>>;
    gridFactories?: Collection<any, RecordFactory<any>>;
    types?: List<any> | Map<string, Type>;
  }

  export interface Model extends ModelConfig {
    defaultButtonComp: ComponentType;
    defaultControlComp: ComponentType;
    defaultFieldComp: ComponentType;
    defaultMenuComp: ComponentType;
    areaFactories: Map<string, RecordFactory<any>>;
    gridFactories: Map<string, RecordFactory<any>>;
    types: Map<string, Type>;
  }

  export const selector = 'config';
}

export default ItmConfig;
