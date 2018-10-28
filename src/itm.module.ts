import 'reflect-metadata';

import { CommonModule } from '@angular/common';
import { NgModule, InjectionToken, ModuleWithProviders, Optional } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Map } from 'immutable';

import Area from './area';
import { ItmAreaDirective } from './area.directive';
import Button from './button';
import { ItmButtonComponent } from './button.component';
import Column from './column';
import Control from './control';
import { ItmControlComponent } from './control.component';
import { ItmConfig } from './config';
import Field from './field';
import { ItmFieldComponent } from './field.component';
import Form from './form';
import Grid from './grid';
import { ItmGridComponent } from './grid.component';
import { ItmMaterialModule } from './material.module';
import Table from './table';
import { ItmTableComponent } from './table.component';
import { ItmTextAreaComponent } from './text-area.component';
import { ITM_TYPE_PIPES } from './type.pipes';

const IMPORTS = [
  CommonModule,
  ReactiveFormsModule,
  ItmMaterialModule
];

const ENTRY_COMPONENTS = [
  ItmButtonComponent,
  ItmControlComponent,
  ItmFieldComponent,
  ItmTextAreaComponent
];

const DECLARATIONS = [
  ItmAreaDirective
];

const EXPORTED_DECLARATIONS = [
  ItmGridComponent,
  ItmTableComponent,
  ...ITM_TYPE_PIPES
];

export const DEFAULT_CONFIG: ItmConfig.Model = {
  defaultButtonComp: ItmButtonComponent,
  defaultControlComp: ItmControlComponent,
  defaultFieldComp: ItmFieldComponent,
  defaultTextComp: ItmTextAreaComponent,
  areaFactories: Map<string, Area.Factory>()
    .set(Area.factory.selector, Area.factory)
    .set(Button.factory.selector, Button.factory)
    .set(Column.factory.selector, Column.factory)
    .set(Control.factory.selector, Control.factory)
    .set(Field.factory.selector, Field.factory),
  gridFactories: Map<string, Grid.Factory>()
    .set(Grid.factory.selector, Grid.factory)
    .set(Form.factory.selector, Form.factory)
    .set(Table.factory.selector, Table.factory),
  types: null
};

const CONFIG_INIT_TOKEN = new InjectionToken('ITM_CONFIG_INIT');

const CONFIG_PROVIDER = {
  provide: ItmConfig,
  deps: [[new Optional(), CONFIG_INIT_TOKEN]],
  useFactory: (config: ItmConfig.ModelConfig = null): ItmConfig => ItmConfig.factory.serialize(
    DEFAULT_CONFIG,
    config
  )
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
    areaFactories?: Area.Factory[];
    gridFactories?: Grid.Factory[];
    config?: ItmConfig;
  }

  export function create(config: ItmConfig.ModelConfig): ModuleWithProviders<ItmModule> {
    return {
      ngModule: ItmModule,
      providers: [
        {provide: CONFIG_INIT_TOKEN, useValue: config || null}
      ]
    };
  }
}
