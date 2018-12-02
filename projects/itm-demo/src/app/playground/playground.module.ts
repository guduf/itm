import { NgModule } from '@angular/core';

import { JsonEditorComponent } from './json_editor.component';
import { SharedModule } from '../shared/shared.module';
import { EditorService } from './editor.service';
import { Routes, RouterModule } from '@angular/router';
import { AjvErrorsComponent } from './ajv_errors.component';
import { PageComponent } from '../shared/page.component';
import { GRID_PLAYGROUNDS } from './grid_playground';
import { JsonPlaygroundComponent } from './json_playground.component';
import { GridPlaygroundViewComponent } from './grid_playground_view.component';

const ROUTES: Routes = [
  {
    path: '',
    component: PageComponent,
    children: [
      {
        path: 'grid',
        component: JsonPlaygroundComponent,
        data: {
          viewComp: GridPlaygroundViewComponent,
          playgrounds: GRID_PLAYGROUNDS,
          hashRoutes: Object.keys(GRID_PLAYGROUNDS)
        }
      },
      {path: '**', redirectTo: '/playground/grid', pathMatch: 'full'}
    ]
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
    AjvErrorsComponent,
    JsonPlaygroundComponent,
    GridPlaygroundViewComponent
  ],
  providers: [
    EditorService
  ],
  entryComponents: [
    GridPlaygroundViewComponent
  ]
})
export class PlaygroundModule { }
