import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';
import { PageComponent } from './page.component';
import { ItmCoreModule } from '../../../../itm-core/src/public_api';
import { TranslateModule } from '@ngx-translate/core';

const IMPORTS = [
  CommonModule,
  HttpClientModule,
  MaterialModule,
  ItmCoreModule,
  RouterModule
];

const DECLARATIONS = [
  PageComponent
];

@NgModule({
  declarations: DECLARATIONS,
  imports: [IMPORTS, TranslateModule.forChild()],
  exports: [...DECLARATIONS, ...IMPORTS]
})
export class SharedModule { }
