import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app_header.component';
import { BasicExampleContainerComponent } from './basic_example_container.component';
import { BackgroundComponent } from './background.component';
import { ExampleModule } from './example/example.module';
import { HomePageComponent } from './home_page.component';
import { SchemaComponent } from './schema.component';
import { SharedModule } from './shared/shared.module';
import { PlaygroundModule } from './playground/playground.module';
import { CoreModule } from './core.module';

export function loadPlaygroundModule() { return PlaygroundModule; }

const ROUTES: Routes = [
  {path: 'playground', loadChildren: loadPlaygroundModule},
  {path: '**', component: HomePageComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    BackgroundComponent,
    HomePageComponent,
    SchemaComponent,
    BasicExampleContainerComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    RouterModule.forRoot(ROUTES),
    ExampleModule,
    MarkdownModule.forChild()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
