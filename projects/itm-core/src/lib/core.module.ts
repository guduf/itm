import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ItmAreaDirective } from './area.directive';
import { ItmButtonAreaComponent } from './button_area.component';
import { ItmControlComponent } from './control.component';
import { ItmFieldComponent } from './field.component';
import { ItmFormComponent } from './form.component';
import { ItmGridComponent } from './grid.component';
import { ItmMaterialModule } from './material.module';
import { ItmTableComponent } from './table.component';
import { ITM_TYPE_PIPES } from './type.pipes';
import { ItmMenuComponent } from './menu.component';
import { ITM_REGISTRER_PROVIDER } from './registrer';

const IMPORTS = [
  CommonModule,
  ReactiveFormsModule,
  ItmMaterialModule
];

const ENTRY_COMPONENTS = [
  ItmButtonAreaComponent,
  ItmControlComponent,
  ItmFieldComponent,
  ItmMenuComponent
];

const DECLARATIONS = [
  ItmAreaDirective
];

const EXPORTED_DECLARATIONS = [
  ItmFormComponent,
  ItmGridComponent,
  ItmTableComponent,
  ...ITM_TYPE_PIPES
];

/** The core module of the library. */
@NgModule({
  imports: IMPORTS,
  exports: EXPORTED_DECLARATIONS,
  declarations: [...DECLARATIONS, ...ENTRY_COMPONENTS, ...EXPORTED_DECLARATIONS],
  entryComponents: ENTRY_COMPONENTS,
  providers: [ITM_REGISTRER_PROVIDER]
})
export class ItmCoreModule { }
