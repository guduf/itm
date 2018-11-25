import { NgModule } from '@angular/core';

import { PlaygroundPageComponent } from './playground_page.component';
import { JsonEditorComponent } from './json_editor.component';
import { SharedModule } from '../shared/shared.module';
import { EditorService } from './editor.service';
import { GridPlaygroundComponent } from './grid_playground.component';
import { Routes, RouterModule } from '@angular/router';
import { AjvErrorsComponent } from './ajv_errors.component';

const ROUTES: Routes = [
  {
    path: 'playground',
    component: PlaygroundPageComponent,
    children: [
      {path: 'grid', component: GridPlaygroundComponent},
      {path: '', redirectTo: './grid', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES)
  ],
  exports: [PlaygroundPageComponent, RouterModule],
  declarations: [
    JsonEditorComponent,
    PlaygroundPageComponent,
    GridPlaygroundComponent,
    AjvErrorsComponent
  ],
  providers: [
    EditorService
  ]
})
export class PlaygroundModule { }
