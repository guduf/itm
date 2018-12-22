import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app_header.component';
import { CoreModule } from './core.module';
import { ExampleModule } from './example/example.module';
import { SharedModule } from './shared/shared.module';

const ROUTES: Routes = [
  {path: 'playground', loadChildren: './playground/playground.module#PlaygroundModule'},
  {path: '**', loadChildren: './home/home.module#HomeModule'}
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
