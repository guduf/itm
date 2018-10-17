import 'reflect-metadata';

import { CommonModule } from '@angular/common';
// tslint:disable-next-line:max-line-length
import { NgModule, InjectionToken, ModuleWithProviders, Optional, StaticProvider } from '@angular/core';
import { Map, List } from 'immutable';

import ActionArea from './action-area';
import Area from './area';
import Column from './column';
import Control from './control';
import Field from './field';
import Form from './form';
import Grid from './grid';
import { ItmButtonComponent } from './button.component';
import { ItmConfig } from './config';
import { ItmMaterialModule } from './material.module';
import { ItmTableComponent } from './table.component';
import { ItmButtonsComponent } from './buttons.component';
import { ItmTypeService, ItmTableTypePipe, ItmTypeGridPipe, ItmTypeFormPipe } from './type.service';
import Type from './type';
import { ItmGridComponent, ITM_GRID_FACTORY_MAP_TOKEN } from './grid.component';
import { ItmFieldComponent } from './field.component';
import { ItmActionsAreaComponent } from './actions-area.component';
import { ItmTextAreaComponent } from './text-area.component';
import { ItmAreaDirective, ITM_AREA_FACTORY_MAP_TOKEN } from './area.directive';
import { ItmControlComponent } from './control.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ItmActionAreaComponent } from './action-area.component';

const IMPORTS = [
  CommonModule,
  ReactiveFormsModule,
  ItmMaterialModule
];

const ENTRY_COMPONENTS = [
  ItmActionAreaComponent,
  ItmActionsAreaComponent,
  ItmFieldComponent,
  ItmTextAreaComponent,
  ItmControlComponent,
];

const DECLARATIONS = [
  ItmAreaDirective
];

const EXPORTED_DECLARATIONS = [
  ItmButtonComponent,
  ItmButtonsComponent,
  ItmGridComponent,
  ItmTypeGridPipe,
  ItmTableComponent,
  ItmTableTypePipe,
  ItmTypeFormPipe
];

export const DEFAULT_CONFIG: ItmConfig = {
  defaultActionsAreaComp: ItmActionsAreaComponent,
  defaultTextAreaComp: ItmTextAreaComponent,
  selectedCheckBoxIcon: 'check_box',
  unselectedCheckBoxIcon: 'check_box_outline_blank',
  indeterminateCheckBoxIcon: 'indeterminate_check_box'
};

export const ITM_CONFIG = new InjectionToken('ITM_CONFIG');

const configFactory = (config: ItmConfig = {}): ItmConfig => ({...DEFAULT_CONFIG, ...config});

const TYPES_INIT_TOKEN = new InjectionToken<any[]>('ITM_TYPES_INIT_TOKEN');

const TYPE_RECORD_MAP_PROVIDER: StaticProvider = {
  provide: Type.RECORD_MAP_TOKEN,
  deps: [[new Optional(), TYPES_INIT_TOKEN]],
  useFactory: (typeCtors: any[] = []) => typeCtors.reduce(
    (map, target) => {
      const record = Type.get(target);
      if (!Type.factory.isFactoryRecord(record)) throw new TypeError('Expected ItmType record');
      return map.set(record.key, record);
    },
    Map<string, Type>()
  )
};

const BUILTIN_AREA_FACTORIES: Area.Factory[] = [
  ActionArea.factory,
  Area.factory,
  Column.factory,
  Control.factory,
  Field.factory
];

// tslint:disable-next-line:max-line-length
const AREA_FACTORIES_INIT_TOKEN = new InjectionToken<Area.Factory[]>('ITM_AREA_FACTORIES_INIT_TOKEN');

const AREA_FACTORY_MAP_PROVIDER = {
  provide: ITM_AREA_FACTORY_MAP_TOKEN,
  deps: [[new Optional(), AREA_FACTORIES_INIT_TOKEN]],
  useFactory: (factories: Area.Factory[] = []) => List(factories)
    .merge(BUILTIN_AREA_FACTORIES)
    .reduce(
      (map, factory) => {
        if (!Area.factory.isExtendedFactory(factory)) throw new TypeError('Expected Area factory');
        return map.set(factory.selector, factory);
      },
      Map<string, Area.Factory>()
    )
};

// tslint:disable-next-line:max-line-length
const GRID_FACTORIES_INIT_TOKEN = new InjectionToken<Grid.Factory[]>('ITM_GRID_FACTORIES_INIT_TOKEN');

const BUILTIN_GRID_FACTORIES: Grid.Factory[] = [
  Grid.factory,
  Form.factory
];

const GRID_FACTORY_MAP_PROVIDER = {
  provide: ITM_GRID_FACTORY_MAP_TOKEN,
  deps: [[new Optional(), GRID_FACTORIES_INIT_TOKEN]],
  useFactory: (factories: Grid.Factory[] = []) => List(factories)
    .merge(BUILTIN_GRID_FACTORIES)
    .reduce(
      (map, factory) => {
        if (!Grid.factory.isExtendedFactory(factory)) throw new TypeError('Expected Grid factory');
        return map.set(factory.selector, factory);
      },
      Map<string, Grid.Factory>()
    )
};

const PROVIDERS: StaticProvider[] = [
  {provide: ItmConfig, deps: [[new Optional(), ITM_CONFIG]], useFactory: configFactory},
  AREA_FACTORY_MAP_PROVIDER,
  TYPE_RECORD_MAP_PROVIDER,
  GRID_FACTORY_MAP_PROVIDER
];

const SERVICES = [
  ItmTypeService
];

@NgModule({
  imports: IMPORTS,
  exports: [...EXPORTED_DECLARATIONS],
  declarations: [...DECLARATIONS, ...ENTRY_COMPONENTS, ...EXPORTED_DECLARATIONS],
  entryComponents: ENTRY_COMPONENTS,
  providers: [...PROVIDERS, ...SERVICES]
})
/** The main module of the library. */
export class ItmModule { }

export module ItmModule {
  export interface Init {
    types?: any[];
    areaFactories?: Area.Factory[];
    gridFactories?: Grid.Factory[];
    config?: ItmConfig;
  }

  export function create(init: Init): ModuleWithProviders<ItmModule> {
    return {
      ngModule: ItmModule,
      providers: [
        {provide: ITM_CONFIG, useValue: init.config || {}},
        {provide: AREA_FACTORIES_INIT_TOKEN, useValue: init.areaFactories || []},
        {provide: GRID_FACTORIES_INIT_TOKEN, useValue: init.gridFactories || []},
        {provide: TYPES_INIT_TOKEN, useValue: init.types || []}
      ]
    };
  }
}
