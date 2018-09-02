import { CommonModule } from '@angular/common';
import { NgModule, InjectionToken, Optional } from '@angular/core';

import { ItmActionsCellDirective } from './actions-cell.directive';
import { ItmButtonComponent } from './button.component';
import { ItmCellDirective } from './cell.directive';
import { ItmConfig } from './config';
import { ItmDefaultActionsCellComponent } from './default-actions-cell.component';
import { ItmDefaultCellComponent } from './default-cell.component';
import { ItmDefaultHeaderCellComponent } from './default-header-cell.component';
import { ItmHeaderCellDirective } from './header-cell.directive';
import { ItmMaterialModule } from './material.module';
import { ItmTableComponent } from './table.component';
import { ItmButtonsComponent } from './buttons.component';
import { ItmTableOrganizerDialogComponent } from './table-organizer-dialog.component';
import { ItmDraggableDirective } from './draggable.directive';
import { ItmDroppableDirective } from './droppable.directive';
import { ItmDropPlaceholderDirective } from './drop-placeholder.directive';
import { ItmDragActionService } from './drag.service';
import { ItmListComponent } from './list.component';

const IMPORTS = [
  CommonModule,
  ItmMaterialModule
];

const ENTRY_COMPONENTS = [
  ItmDefaultActionsCellComponent,
  ItmDefaultCellComponent,
  ItmDefaultHeaderCellComponent,
  ItmTableOrganizerDialogComponent
];

const DECLARATIONS = [
  ItmActionsCellDirective,
  ItmCellDirective,
  ItmDefaultCellComponent,
  ItmHeaderCellDirective,
  ItmDefaultActionsCellComponent
];

const EXPORTED_DECLARATIONS = [
  ItmButtonComponent,
  ItmButtonsComponent,
  ItmDraggableDirective,
  ItmDroppableDirective,
  ItmListComponent,
  ItmDropPlaceholderDirective,
  ItmTableComponent
];

export const DEFAULT_CONFIG: ItmConfig = {
  defaultActionsCellComp: ItmDefaultActionsCellComponent,
  defaultCellComp: ItmDefaultCellComponent,
  defaultHeaderCellComp: ItmDefaultHeaderCellComponent,
  selectedCheckBoxIcon: 'check_box',
  unselectedCheckBoxIcon: 'check_box_outline_blank',
  indeterminateCheckBoxIcon: 'indeterminate_check_box'
};

export const ITM_CONFIG = new InjectionToken('ITM_CONFIG');

const configFactory = (config: ItmConfig = {}) => ({...DEFAULT_CONFIG, ...config});

const PROVIDERS = [
  {provide: ItmConfig, deps: [[new Optional(), ITM_CONFIG]], useFactory: configFactory},
  ItmDragActionService
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
