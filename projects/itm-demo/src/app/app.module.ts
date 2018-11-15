import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor.component';
import { MaterialModule } from './material.module';
import { MONACO_PROVIDERS } from './monaco.service';
import { SchemaComponent } from './schema.component';
import { AppHeaderComponent } from './app_header.component';
import { HomePageComponent } from './home_page.component';
import { BackgroundComponent } from './background.component';

const ROUTES: Routes = [
  { path: '', component: HomePageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    BackgroundComponent,
    EditorComponent,
    HomePageComponent,
    SchemaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    RouterModule.forRoot(
      ROUTES,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [
    MONACO_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
