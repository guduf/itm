import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from './material.module';
import { ItmCoreModule } from '../../../../itm-core/src/public_api';

const IMPORTS = [
  BrowserModule,
  HttpClientModule,
  MaterialModule,
  ItmCoreModule
];

@NgModule({
  declarations: [],
  imports: IMPORTS,
  exports: IMPORTS
})
export class SharedModule { }
