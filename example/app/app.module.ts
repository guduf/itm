import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ItmModule } from 'src/itm.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ItmModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
