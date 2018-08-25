import { CommonModule } from '@angular/common';
import { NgModule, InjectionToken, Optional } from '@angular/core';

import { ItmCellDirective } from './cell.directive';
import { ItmDefaultCellComponent } from './default-cell.component';
import { ItmDefaultHeaderCellComponent } from './default-header-cell.component';
import { ItmHeaderCellDirective } from './header-cell.directive';
import { ItmConfig } from './itm-config';
import { ItmTableComponent } from './table.component';
import { ItmMaterialModule } from './material.module';

const IMPORTS = [
  CommonModule,
  ItmMaterialModule
];

const ENTRY_COMPONENTS = [
  ItmDefaultCellComponent,
  ItmDefaultHeaderCellComponent
];

const DECLARATIONS = [
  ItmCellDirective,
  ItmDefaultCellComponent,
  ItmHeaderCellDirective
];

const EXPORTED_DECLARATIONS = [
  ItmTableComponent
];

const DEFAULT_CONFIG: ItmConfig = {
  defaultCellComp: ItmDefaultCellComponent,
  defaultHeaderCellComp: ItmDefaultHeaderCellComponent
};

export const ITM_CONFIG = new InjectionToken('ITM_CONFIG');

const configFactory = (config: ItmConfig = {}) => ({...DEFAULT_CONFIG, ...config});

const PROVIDERS = [
  {provide: ItmConfig, deps: [[new Optional(), ITM_CONFIG]], useFactory: configFactory}
];

@NgModule({
  imports: IMPORTS,
  exports: [...EXPORTED_DECLARATIONS],
  declarations: [...DECLARATIONS, ...ENTRY_COMPONENTS, ...EXPORTED_DECLARATIONS],
  entryComponents: ENTRY_COMPONENTS,
  providers: PROVIDERS
})
/** The main module of the library. */
export class ItmModule { }
