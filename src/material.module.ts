import { NgModule} from '@angular/core';
// tslint:disable-next-line:max-line-length
import { MatTableModule, MatIconModule, MatButtonModule, MatMenuModule, MatDialogModule, MatListModule, MatToolbarModule, MatInputModule } from '@angular/material';

const MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatTableModule,
  MatToolbarModule
];

@NgModule({
  imports: MODULES,
  exports: MODULES,
})
/** The package of imported Material modules. */
export class ItmMaterialModule { }
