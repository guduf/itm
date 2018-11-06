import { Map, RecordOf, Collection, List } from 'immutable';

import { InjectionToken } from '@angular/core';
import RecordFactory from './record_factory';
import Type from './type';
import { ComponentType, AbstractRecord } from './utils';

export const ITM_OPTIONS = new InjectionToken<ItmOptions>('ITM_OPTIONS');

/** The global options for the module */
// tslint:disable-next-line:max-line-length
export abstract class ItmOptions extends AbstractRecord<ItmOptions.Model> implements RecordOf<ItmOptions.Model> {
  /** The component displayed in the button area when not specified in options. */
  defaultButtonComp: ComponentType;

  /** The component displayed in the control area when not specified in options. */
  defaultControlComp: ComponentType;

  /** The component displayed in the field area when not specified in options. */
  defaultFieldComp: ComponentType;

  /** The component displayed in the menu area when not specified in options. */
  defaultMenuComp: ComponentType;
}

export module ItmOptions {
  export interface Config {
    defaultButtonComp?: ComponentType;
    defaultControlComp?: ComponentType;
    defaultFieldComp?: ComponentType;
    defaultMenuComp?: ComponentType;
  }

  export interface Model extends Config {
    defaultButtonComp: ComponentType;
    defaultControlComp: ComponentType;
    defaultFieldComp: ComponentType;
    defaultMenuComp: ComponentType;
  }

  export const selector = 'options';
}

export default ItmOptions;
