import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItmCoreModule } from '../../../itm-core/src/public_api';
import { YamlEditorComponent } from './yaml_editor.component';

@NgModule({
  declarations: [
    AppComponent,
    YamlEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ItmCoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
