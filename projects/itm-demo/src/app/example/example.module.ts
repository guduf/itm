import { NgModule, InjectionToken } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BasicExampleComponent } from './basic_example.component';
import { RadarExampleComponent } from './radar_example.component';
import { ExampleMarkdownPipe, EXAMPLE_MARDOWN_CACHE } from './example_markdown.pipe';

const EXAMPLE_ENTRY_COMPONENTS = [
  RadarExampleComponent
];

const EXAMPLE_COMPONENTS = [
  BasicExampleComponent
];

@NgModule({
  imports: [SharedModule],
  exports: [...EXAMPLE_COMPONENTS, ExampleMarkdownPipe],
  declarations: [...EXAMPLE_COMPONENTS, ...EXAMPLE_ENTRY_COMPONENTS, ExampleMarkdownPipe],
  entryComponents: EXAMPLE_ENTRY_COMPONENTS,
  providers: [{provide: EXAMPLE_MARDOWN_CACHE, useValue: {}}],
})
export class ExampleModule { }
