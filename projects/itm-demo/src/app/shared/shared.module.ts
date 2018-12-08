import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ItmCoreModule } from '../itm';
import { MaterialModule } from './material.module';
import { PageComponent } from './page.component';

const IMPORTS = [
  CommonModule,
  HttpClientModule,
  MaterialModule,
  ItmCoreModule,
  RouterModule,
  TranslateModule
];

const DECLARATIONS = [
  PageComponent
];

@NgModule({
  declarations: DECLARATIONS,
  imports: [IMPORTS],
  exports: [...DECLARATIONS, ...IMPORTS]
})
export class SharedModule { }
