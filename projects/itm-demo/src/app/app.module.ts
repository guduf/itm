import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

import { ItmCoreModule } from '../../../itm-core/src/public_api';

import { AppComponent } from './app.component';
import { BasicExampleComponent } from './example/basic_example.component';
import { RadarExampleComponent } from './example/radar_example.component';
import { EditorComponent } from './editor.component';
import { MaterialModule } from './material.module';
import { MONACO_PROVIDERS } from './monaco.service';
import { SchemaComponent } from './schema.component';
import { AppHeaderComponent } from './app_header.component';
import { HomePageComponent } from './home_page.component';
import { BackgroundComponent } from './background.component';
import { ExampleMarkdownPipe } from './example/example_markdown.pipe';
import { BasicExampleContainerComponent } from './basic_example_container.component';

const ROUTES: Routes = [
  {path: '', component: HomePageComponent}
];

const ENTRY_COMPONENTS = [
  RadarExampleComponent
];

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    BackgroundComponent,
    EditorComponent,
    HomePageComponent,
    SchemaComponent,
    BasicExampleComponent,
    ExampleMarkdownPipe,
    BasicExampleContainerComponent,
    ...ENTRY_COMPONENTS
  ],
  entryComponents: ENTRY_COMPONENTS,
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    MarkdownModule.forRoot(),
    RouterModule.forRoot(ROUTES),
    ItmCoreModule
  ],
  providers: [
    MONACO_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
