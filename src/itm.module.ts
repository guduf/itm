import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material';

import { ItmCellDirective, ItmHeaderCellDirective } from './cell.directive';
import { ItmDefaultCellComponent } from './default-cell.component';
import { ItmDefaultHeaderCellComponent } from './default-header-cell.component';
import { ItmTableComponent } from './table.component';

const IMPORTS = [
  CommonModule,
  MatTableModule
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


@NgModule({
  imports: IMPORTS,
  exports: [...EXPORTED_DECLARATIONS],
  declarations: [...DECLARATIONS, ...ENTRY_COMPONENTS, ...EXPORTED_DECLARATIONS],
  entryComponents: ENTRY_COMPONENTS
})
/** The main module of the library. */
export class ItmModule { }
