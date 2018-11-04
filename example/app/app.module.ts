import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { List } from 'immutable';
import { ItmModule } from 'itm-core';

import { AppComponent } from './app.component';
import { User } from './user';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ItmModule.create({types: List([User])})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
