import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ItmCoreModule, ItmReflector } from 'itm-core';

import { AppComponent } from './app.component';
import { User } from './user';

const typesProvider = ItmReflector.provide(User);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ItmCoreModule
  ],
  providers: [typesProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
