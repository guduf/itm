import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ItmCoreModule, ITM_INIT } from 'itm-core';

import { AppComponent } from './app.component';
import { User } from './user';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ItmCoreModule
  ],
  providers: [{provide: ITM_INIT, multi: true, useValue: {types: [User]}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
