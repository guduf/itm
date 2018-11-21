import { APP_INITIALIZER, NgModule, NgZone } from '@angular/core';
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

const MONACO_INIT_PROVIDER = {
  provide: APP_INITIALIZER,
  multi: true,
  deps: [NgZone],
  useFactory: (zone: NgZone) => () => {
    console.log('Load monaco…');
    if (typeof window === 'undefined') {
      console.log('Monaco is not loaded because window is undefined');
      return Promise.resolve();
    }
    if (typeof initMonaco !== 'function') {
      const err = new ReferenceError('Failed to found initMonaco function');
      return Promise.reject(err);
    }
    return zone.runOutsideAngular(() => (
      initMonaco().then(() => console.log('Monaco is loaded.'))
    ));
  }
};

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
  providers: [
    MONACO_INIT_PROVIDER
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
