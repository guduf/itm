import { NgModule} from '@angular/core';
import { MatTableModule, MatIconModule, MatButtonModule } from '@angular/material';

const MODULES = [
  MatIconModule,
  MatButtonModule,
  MatTableModule
];

@NgModule({
  imports: MODULES,
  exports: MODULES,
})
/** The package of imported Material modules. */
export class ItmMaterialModule { }
