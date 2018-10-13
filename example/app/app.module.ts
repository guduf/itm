import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ItmModule } from 'src/itm.module';
import { MatCheckboxModule, MatTableModule } from '@angular/material';
import { User } from './user';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatTableModule,
    ItmModule.create({types: [User]})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
