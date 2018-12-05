import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

import { BasicExampleContainerComponent } from './basic_example_container.component';
import { BackgroundComponent } from './background.component';
import { HomePageComponent } from './home_page.component';
import { SchemaComponent } from './schema.component';
import { SharedModule } from '../shared/shared.module';
import { ExampleModule } from '../example/example.module';

const ROUTES: Routes = [
  {path: '', component: HomePageComponent}
];

@NgModule({
  declarations: [
    BackgroundComponent,
    HomePageComponent,
    SchemaComponent,
    BasicExampleContainerComponent
  ],
  imports: [
    SharedModule,
    ExampleModule,
    MarkdownModule.forChild(),
    RouterModule.forChild(ROUTES)
  ],
  exports: [RouterModule],
})
export class HomeModule { }
