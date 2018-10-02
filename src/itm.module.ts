import 'reflect-metadata';
import { CommonModule } from '@angular/common';
import { NgModule, InjectionToken, ModuleWithProviders, Optional } from '@angular/core';
import { Map } from 'immutable';

import { ItmButtonComponent } from './button.component';
import { ItmConfig } from './config';
import { ItmMaterialModule } from './material.module';
import { ItmTableComponent } from './table.component';
import { ItmButtonsComponent } from './buttons.component';
import { ItmTypeService, ItmTableTypePipe, ItmGridTypePipe } from './type.service';
import Type from './type';
import { ItmGridComponent } from './grid.component';
import { ItmFieldComponent } from './field.component';
import { ItmActionsAreaComponent } from './actions-area.component';
import { ItmTextAreaComponent } from './text-area.component';
import { ItmAreaDirective } from './area.directive';

const IMPORTS = [
  CommonModule,
  ItmMaterialModule
];

const ENTRY_COMPONENTS = [
  ItmActionsAreaComponent,
  ItmFieldComponent,
  ItmTextAreaComponent
];

const DECLARATIONS = [
  ItmAreaDirective
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
  defaultFieldComp: ItmFieldComponent,
  defaultTextAreaComp: ItmTextAreaComponent,
  selectedCheckBoxIcon: 'check_box',
  unselectedCheckBoxIcon: 'check_box_outline_blank',
  indeterminateCheckBoxIcon: 'indeterminate_check_box'
};

export const ITM_CONFIG = new InjectionToken('ITM_CONFIG');

const configFactory = (config: ItmConfig = {}): ItmConfig => ({...DEFAULT_CONFIG, ...config});

export const ITM_TYPES = new InjectionToken('ITM_TYPES');

const typeDefsFactory = (typeCtors: any[] = []): Map<string, Type.Record> => {
  return typeCtors.reduce(
    (acc, target) => {
      const record = Type.get(target);
      if (!Type.factory.isFactoryRecord(record)) throw new TypeError('Expected ItmType record');
      return acc.set(record.key, record);
    },
    Map()
  );
};

const PROVIDERS = [
  {provide: ItmConfig, deps: [[new Optional(), ITM_CONFIG]], useFactory: configFactory},
  {provide: Type.MAP_TOKEN, deps: [[new Optional(), ITM_TYPES]], useFactory: typeDefsFactory},
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
