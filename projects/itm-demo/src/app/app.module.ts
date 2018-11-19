import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor.component';
import { MONACO_PROVIDERS } from './monaco.service';
import { SchemaComponent } from './schema.component';
import { AppHeaderComponent } from './app_header.component';
import { HomePageComponent } from './home_page.component';
import { BackgroundComponent } from './background.component';
import { BasicExampleContainerComponent } from './basic_example_container.component';
import { ExampleModule } from './example/example.module';
import { SharedModule } from './shared/shared.module';

const ROUTES: Routes = [
  {path: '', component: HomePageComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    BackgroundComponent,
    EditorComponent,
    HomePageComponent,
    SchemaComponent,
    BasicExampleContainerComponent
  ],
  imports: [
    SharedModule,
    MarkdownModule.forRoot(),
    RouterModule.forRoot(ROUTES),
    ExampleModule
  ],
  providers: [
    MONACO_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
