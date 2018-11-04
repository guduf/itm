import 'reflect-metadata';

import { CommonModule } from '@angular/common';
import { NgModule, InjectionToken, ModuleWithProviders, Optional } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Map } from 'immutable';

// import { ItmAreaDirective } from './area.directive';
import ButtonAreaFactory from './button_area_factory';
// import { ItmButtonComponent } from './button.component';
import ControlFactory from './control_factory';
// import { ItmControlComponent } from './control.component';
import Config, { ITM_CONFIG } from './config';
import ItmConfigFactory from './config_factory';
// import { ItmFieldComponent } from './field.component';
import FormFactory from './form_factory';
// import { ItmFormComponent } from './form.component';
import { ItmGridComponent } from './grid.component';
import { ItmMaterialModule } from './material.module';
// import { ItmTableComponent } from './table.component';
// import { ITM_TYPE_PIPES } from './type.pipes';
// import { ItmMenuComponent } from './menu.component';
import AreaFactory from './area_factory';
import ColumnFactory from './column_factory';
import FieldFactory from './field_factory';
import MenuFactory from './menu_factory';
import GridFactory from './grid_factory';
import TableFactory from './table_factory';

const IMPORTS = [
  CommonModule,
  ReactiveFormsModule,
  ItmMaterialModule
];

const ENTRY_COMPONENTS = [
  // ItmButtonComponent,
  // ItmControlComponent,
  // ItmFieldComponent,
  // ItmMenuComponent
];

const DECLARATIONS = [
  // ItmAreaDirective
];

const EXPORTED_DECLARATIONS = [
  // ItmFormComponent,
  ItmGridComponent,
  // ItmTableComponent,
  // ...ITM_TYPE_PIPES
];

export const DEFAULT_CONFIG: Config.Model = {
  defaultButtonComp: null, // ItmButtonComponent,
  defaultControlComp: null, // ItmControlComponent,
  defaultFieldComp: null, // ItmFieldComponent,
  defaultMenuComp: null, // ItmMenuComponent,
  areaFactories: Map<string, AreaFactory>()
    .set(AreaFactory().selector, AreaFactory())
    .set(ButtonAreaFactory().selector, ButtonAreaFactory())
    .set(ColumnFactory().selector, ColumnFactory())
    .set(ControlFactory().selector, ControlFactory())
    .set(FieldFactory().selector, FieldFactory())
    .set(MenuFactory().selector, MenuFactory()),
  gridFactories: Map<string, GridFactory>()
    .set(GridFactory().selector, GridFactory())
    .set(FormFactory().selector, FormFactory())
    .set(TableFactory().selector, TableFactory()),
  types: null
};

const CONFIG_INIT_TOKEN = new InjectionToken('ITM_CONFIG_INIT');

export function provideConfig(config: Config.ModelConfig = null): Config {
  return ItmConfigFactory(DEFAULT_CONFIG, config);
}

const CONFIG_PROVIDER = {
  provide: ITM_CONFIG,
  deps: [[new Optional(), CONFIG_INIT_TOKEN]],
  useFactory: provideConfig
};

@NgModule({
  imports: IMPORTS,
  exports: EXPORTED_DECLARATIONS,
  declarations: [...DECLARATIONS, ...ENTRY_COMPONENTS, ...EXPORTED_DECLARATIONS],
  entryComponents: ENTRY_COMPONENTS,
  providers: [CONFIG_PROVIDER]
})
/** The main module of the library. */
export class ItmModule { }

export module ItmModule {
  export interface Init {
    types?: any[];
    areaFactories?: AreaFactory[];
    gridFactories?: GridFactory[];
    config?: Config;
  }

  export function create(config: Config.ModelConfig): ModuleWithProviders<ItmModule> {
    return {
      ngModule: ItmModule,
      providers: [
        {provide: CONFIG_INIT_TOKEN, useValue: config || null}
      ]
    };
  }
}
