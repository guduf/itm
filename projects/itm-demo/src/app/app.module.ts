import { NgModule, NgZone } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app_header.component';
import { BasicExampleContainerComponent } from './basic_example_container.component';
import { BackgroundComponent } from './background.component';
import { ExampleModule } from './example/example.module';
import { HomePageComponent } from './home_page.component';
import { PlaygroundModule } from './playground/playground.module';
import { PlaygroundComponent } from './playground/playground.component';
import { SchemaComponent } from './schema.component';
import { SharedModule } from './shared/shared.module';

declare const initMonaco: () => Promise<void>;

const ROUTES: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'playground', component: PlaygroundComponent}
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
    MarkdownModule.forRoot(),
    RouterModule.forRoot(ROUTES),
    ExampleModule,
    PlaygroundModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
