import 'reflect-metadata';
import { CommonModule } from '@angular/common';
import { NgModule, InjectionToken, ModuleWithProviders, Optional } from '@angular/core';

import { ItmButtonComponent } from './button.component';
import { ItmConfig } from './config';
import { ItmMaterialModule } from './material.module';
import { ItmTableComponent } from './table.component';
import { ItmButtonsComponent } from './buttons.component';
import { ItmTypeService, ItmTableTypePipe, ItmGridTypePipe } from './type.service';
import { ItmTypeDef, getItmTypeDef, ItmTypeDefs } from './type';
import { ItmGridComponent } from './grid.component';
import { ItmGridAreaDirective } from './grid-area.directive';
import { ItmCardAreaComponent } from './card-area.component';
import { ItmActionsAreaComponent } from './actions-area.component';
import { ItmTextAreaComponent } from './text-area.component';
import { ItmHeaderAreaComponent } from './header-area.component';
import { ItmColumnCellDirective, ItmColumnHeaderCellDirective } from './column.directive';
import { ItmActionsAreaDirective } from './actions-area.directive';

const IMPORTS = [
  CommonModule,
  ItmMaterialModule
];

const ENTRY_COMPONENTS = [
  ItmActionsAreaComponent,
  ItmCardAreaComponent,
  ItmTextAreaComponent,
  ItmHeaderAreaComponent,
];

const DECLARATIONS = [
  ItmActionsAreaComponent,
  ItmGridAreaDirective,
  ItmColumnCellDirective,
  ItmColumnHeaderCellDirective,
  ItmActionsAreaDirective
];

const EXPORTED_DECLARATIONS = [
  ItmButtonComponent,
  ItmButtonsComponent,
  ItmGridComponent,
  ItmGridTypePipe,
  ItmTableComponent,
  ItmTableTypePipe
];

export const DEFAULT_CONFIG: ItmConfig = {
  defaultActionsAreaComp: ItmActionsAreaComponent,
  defaultCardAreaComp: ItmCardAreaComponent,
  defaultTextAreaComp: ItmTextAreaComponent,
  defaultHeaderAreaComp: ItmHeaderAreaComponent,
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
