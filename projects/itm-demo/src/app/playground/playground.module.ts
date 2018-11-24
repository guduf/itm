import { NgModule } from '@angular/core';

import { PlaygroundComponent } from './playground.component';
import { EditorComponent } from './editor.component';
import { SharedModule } from '../shared/shared.module';
import { EditorService } from './editor.service';

@NgModule({
  imports: [SharedModule],
  exports: [PlaygroundComponent],
  declarations: [
    EditorComponent,
    PlaygroundComponent
  ],
  providers: [
    EditorService
  ],
})
export class PlaygroundModule { }
