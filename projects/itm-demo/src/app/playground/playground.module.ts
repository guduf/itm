import { NgModule } from '@angular/core';

import { JsonEditorComponent } from './json_editor.component';
import { SharedModule } from '../shared/shared.module';
import { EditorService } from './editor.service';
import { Routes, RouterModule } from '@angular/router';
import { AjvErrorsComponent } from './ajv_errors.component';
import { PageComponent } from '../shared/page.component';
import { GRID_PLAYGROUND_VIEW } from './grid_playground';
import { JsonPlaygroundViewComponent } from './json_playground.component';
import { GridPlaygroundViewComponent } from './grid_playground_view.component';
import { TABLE_PLAYGROUND_VIEW } from './table_playground';
import { TablePlaygroundViewComponent } from './table_playground_view.component';

const ROUTES: Routes = [
  {
    path: '',
    component: PageComponent,
    children: [
      {
        path: 'grid',
        component: JsonPlaygroundViewComponent,
        data: {
          playgroundView: GRID_PLAYGROUND_VIEW,
          hashRoutes: Object.keys(GRID_PLAYGROUND_VIEW.playgrounds)
        }
      },
      {
        path: 'table',
        component: JsonPlaygroundViewComponent,
        data: {
          playgroundView: TABLE_PLAYGROUND_VIEW,
          hashRoutes: Object.keys(TABLE_PLAYGROUND_VIEW.playgrounds)
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
    JsonPlaygroundViewComponent,
    GridPlaygroundViewComponent,
    TablePlaygroundViewComponent
  ],
  providers: [
    EditorService
  ],
  entryComponents: [
    GridPlaygroundViewComponent,
    TablePlaygroundViewComponent
  ]
})
export class PlaygroundModule { }
