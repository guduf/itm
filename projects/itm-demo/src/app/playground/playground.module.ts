import { NgModule } from '@angular/core';

import { JsonEditorComponent } from './json_editor.component';
import { SharedModule } from '../shared/shared.module';
import { EditorService } from './editor.service';
import { GridPlaygroundComponent } from './grid_playground.component';
import { Routes, RouterModule } from '@angular/router';
import { AjvErrorsComponent } from './ajv_errors.component';
import { PageComponent } from '../shared/page.component';
import { GRID_PLAYGROUNDS } from './grid_playground';

const ROUTES: Routes = [
  {
    path: '',
    component: PageComponent,
    children: [
      {
        path: 'grid',
        component: GridPlaygroundComponent,
        data: {
          hashRoutes: Object.keys(GRID_PLAYGROUNDS)
        }
      },
      {path: '**', redirectTo: '/playground/grid', pathMatch: 'full'}
    ],
    data: {
      heading: 'Playground'
    }
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES)
  ],
  exports: [RouterModule],
  declarations: [
    JsonEditorComponent,
    GridPlaygroundComponent,
    AjvErrorsComponent
  ],
  providers: [
    EditorService
  ]
})
export class PlaygroundModule { }
