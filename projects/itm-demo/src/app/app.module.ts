import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app_header.component';
import { CoreModule } from './core.module';
import { ExampleModule } from './example/example.module';
import { HomeModule } from './home/home.module';
import { PlaygroundModule } from './playground/playground.module';
import { SharedModule } from './shared/shared.module';

export function loadHomeModule() { return HomeModule; }
export function loadPlaygroundModule() { return PlaygroundModule; }

const ROUTES: Routes = [
  {path: 'playground', loadChildren: loadPlaygroundModule},
  {path: '**', loadChildren: loadHomeModule}
];

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent
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
