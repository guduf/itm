import 'reflect-metadata';
import { CommonModule } from '@angular/common';
import { NgModule, InjectionToken, ModuleWithProviders, Optional } from '@angular/core';

import { ItmActionsCellDirective } from './actions-cell.directive';
import { ItmButtonComponent } from './button.component';
import { ItmCellDirective } from './cell.directive';
import { ItmConfig } from './config';
import { ItmDefaultActionsCellComponent } from './default-actions-cell.component';
import { ItmDefaultCellComponent } from './default-cell.component';
import { ItmDefaultHeaderCellComponent } from './default-header-cell.component';
import { ItmHeaderCellDirective } from './header-cell.directive';
import { ItmLocalePipe } from './locale.pipe';
import { ItmMaterialModule } from './material.module';
import { ItmTableComponent } from './table.component';
import { ItmButtonsComponent } from './buttons.component';
import { ItmTypeService, ItmTableTypePipe, ItmCardTypePipe } from './type.service';
import { ItmTypeDef, getItmTypeDef, ItmTypeDefs } from './type';
import { ItmCardComponent } from './card.component';
import { ItmCardAreaDirective } from './card-area.directive';
import { ItmDefaultCardAreaComponent } from './default-card-area.component';

const IMPORTS = [
  CommonModule,
  ItmMaterialModule
];

const ENTRY_COMPONENTS = [
  ItmDefaultActionsCellComponent,
  ItmDefaultCardAreaComponent,
  ItmDefaultCellComponent,
  ItmDefaultHeaderCellComponent,
];

const DECLARATIONS = [
  ItmActionsCellDirective,
  ItmCardAreaDirective,
  ItmCellDirective,
  ItmDefaultCellComponent,
  ItmHeaderCellDirective,
  ItmDefaultActionsCellComponent,
];

const EXPORTED_DECLARATIONS = [
  ItmButtonComponent,
  ItmButtonsComponent,
  ItmCardComponent,
  ItmCardTypePipe,
  ItmLocalePipe,
  ItmTableComponent,
  ItmTableTypePipe
];

export const DEFAULT_CONFIG: ItmConfig = {
  defaultActionsCellComp: ItmDefaultActionsCellComponent,
  defaultCardAreaComp: ItmDefaultCardAreaComponent,
  defaultCellComp: ItmDefaultCellComponent,
  defaultHeaderCellComp: ItmDefaultHeaderCellComponent,
  selectedCheckBoxIcon: 'check_box',
  unselectedCheckBoxIcon: 'check_box_outline_blank',
  indeterminateCheckBoxIcon: 'indeterminate_check_box'
};

export const ITM_CONFIG = new InjectionToken('ITM_CONFIG');

const configFactory = (config: ItmConfig = {}): ItmConfig => ({...DEFAULT_CONFIG, ...config});

export const ITM_TYPES = new InjectionToken('ITM_TYPES');

const typeDefsFactory = (typeCtors: any[] = []): ItmTypeDefs => {
  const typeDefs = new Map<string, ItmTypeDef>();
  for (const typeCtor of typeCtors) {
    const typeDef = getItmTypeDef(typeCtor);
    if (!typeDef) throw new ReferenceError(`TypeDefNotFound for : ${typeCtor.toString()}`);
    typeDefs.set(typeDef.key, typeDef);
  }
  return typeDefs;
};

const PROVIDERS = [
  {provide: ItmConfig, deps: [[new Optional(), ITM_CONFIG]], useFactory: configFactory},
  {provide: ItmTypeDefs, deps: [[new Optional(), ITM_TYPES]], useFactory: typeDefsFactory},
  ItmTypeService,
];

@NgModule({
  imports: IMPORTS,
  exports: [...EXPORTED_DECLARATIONS],
  declarations: [...DECLARATIONS, ...ENTRY_COMPONENTS, ...EXPORTED_DECLARATIONS],
  entryComponents: ENTRY_COMPONENTS,
  providers: PROVIDERS
})
/** The main module of the library. */
export class ItmModule {
  static create(types: any[], config?: ItmConfig): ModuleWithProviders {
    return {
      ngModule: ItmModule,
      providers: [
        {provide: ITM_CONFIG, useValue: config},
        {provide: ITM_TYPES, useValue: types}
      ]
    };
  }
}
