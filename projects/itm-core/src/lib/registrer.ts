import { Optional, InjectionToken, FactoryProvider } from '@angular/core';
import { Map } from 'immutable';

import AreaFactory from './area_factory';
import ButtonAreaFactory from './button_area_factory';
import { ItmButtonAreaComponent } from './button_area.component';
import ColumnFactory from './column_factory';
import ControlFactory from './control_factory';
import { ItmControlComponent } from './control.component';
import FieldFactory from './field_factory';
import { ItmFieldComponent } from './field.component';
import FormFactory from './form_factory';
import GridFactory from './grid_factory';
import MenuFactory from './menu_factory';
import { ItmMenuComponent } from './menu.component';
import Options from './options';
import OptionsFactory from './options_factory';
import TableFactory from './table_factory';
import Type from './type';
import TypeFactory from './type_factory';
import { BehaviorSubject } from 'rxjs';
import { parseIter } from './utils';

export class ItmRegistrer implements ItmRegistrer.Registry {
  /** Records that defines item types. */
  get types(): Map<string, Type> { return this.registry.value.types; }

  /** Record factories to build grids. Allows to extend the generic grid model. */
  get gridFactories(): Map<string, GridFactory<any>> { return this.registry.value.gridFactories; }

  /** Record factories to build areas. Allows to extend the generic area model. */
  get areaFactories(): Map<string, AreaFactory<any>> { return this.registry.value.areaFactories; }

  get options(): Options { return this.registry.value.options; }

  readonly registry: BehaviorSubject<ItmRegistrer.Registry>;

  constructor(init: Partial<ItmRegistrer.Init>[]) {
    if (!Array.isArray(init)) init = [init];
    this.registry = this._initRegistry(init);
  }

  private _initRegistry(inits: ItmRegistrer.Init[]): BehaviorSubject<ItmRegistrer.Registry> {
    const initData = inits.reduce(
      ({types, gridFactories, areaFactories, options}, init) => {
        if (init.types) types = types.merge(
          parseIter(init.types, 'key', factory => {
            // tslint:disable-next-line:max-line-length
            if (!TypeFactory().isFactoryRecord(factory)) throw new TypeError('Expected type');
          })
        );
        // tslint:disable-next-line:max-line-length
        if (init.areaFactories) areaFactories = areaFactories.merge(
          parseIter(init.areaFactories, 'selector', factory => {
            // tslint:disable-next-line:max-line-length
            if (!AreaFactory().isExtendedFactory(factory)) throw new TypeError('Expected area factory');
          })
        );
        if (init.gridFactories) gridFactories = gridFactories.merge(
          parseIter(init.gridFactories, 'selector', factory => {
            // tslint:disable-next-line:max-line-length
            if (!GridFactory().isExtendedFactory(factory)) throw new TypeError('Expected grid factory');
          })
        );
        if (init.options) options = [...options, init.options];
        return {types, gridFactories, areaFactories, options};
      },
      {...DEFAULT_REGISTRY, options: [DEFAULT_REGISTRY.options as Options.Config]}
    );
    return new BehaviorSubject({
      ...initData,
      options: OptionsFactory().serialize(...initData.options)
    });
  }
}

export module ItmRegistrer {
  export interface Init {
    types?: Type[];
    areaFactories?: AreaFactory<any>[];
    gridFactories?: GridFactory<any>[];
    options?: Options.Config;
  }

  export interface Registry {
    types: Map<string, Type>;
    areaFactories: Map<string, AreaFactory>;
    gridFactories: Map<string, GridFactory>;
    options: Options;
  }

  export function provide(init: any) { return new ItmRegistrer(init); }
}

const DEFAULT_OPTIONS: Options.Model = {
  defaultButtonComp: ItmButtonAreaComponent,
  defaultControlComp: ItmControlComponent,
  defaultFieldComp: ItmFieldComponent,
  defaultMenuComp: ItmMenuComponent,
};

const DEFAULT_AREA_FACTORIES: AreaFactory[] = [
  AreaFactory(),
  ButtonAreaFactory(),
  ColumnFactory(),
  ControlFactory(),
  FieldFactory(),
  MenuFactory()
];

const DEFAULT_GRID_FACTORIES: GridFactory[] = [
  GridFactory(),
  FormFactory(),
  TableFactory()
];

const DEFAULT_REGISTRY: ItmRegistrer.Registry = {
  types: Map(),
  areaFactories: parseIter(DEFAULT_AREA_FACTORIES, 'selector'),
  gridFactories: parseIter(DEFAULT_GRID_FACTORIES, 'selector'),
  options: DEFAULT_OPTIONS as Options
};

export const ITM_INIT  = new InjectionToken('ITM_INIT');

export const ITM_REGISTRER  = new InjectionToken('ITM_REGISTRER');

export const ITM_REGISTRER_PROVIDER: FactoryProvider = {
  provide: ITM_REGISTRER,
  deps: [[new Optional(), ITM_INIT]],
  useFactory: ItmRegistrer.provide
};

export default ItmRegistrer;
