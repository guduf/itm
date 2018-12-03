
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  InjectionToken,
  Injector,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Map } from 'immutable';
import { BehaviorSubject, combineLatest, merge, Subscription, asyncScheduler } from 'rxjs';
import { map, tap, distinctUntilKeyChanged, observeOn, reduce } from 'rxjs/operators';

import { EditorModel, InvalidEditorModel } from './editor.service';
import { JsonEditorModel } from './json_editor.component';


// tslint:disable-next-line:max-line-length
export const ITM_DEMO_JSON_PLAYGROUND_MODELS = new InjectionToken('ITM_DEMO_JSON_PLAYGROUND_MODELS');

@Component({
  selector: 'itm-demo-json-playground',
  templateUrl: 'json_playground.component.html',
  styleUrls: ['json_playground.component.scss']
})
export class JsonPlaygroundComponent implements AfterViewInit, OnDestroy {
  files: JsonEditorModel[];

  @ViewChild('viewCompContainer', {read: ViewContainerRef})
  viewCompContainerRef: ViewContainerRef;

  editorFile: string;
  readonly models = new BehaviorSubject<{ [key: string]: Object }>({});
  errors = Map<string, Object>();
  errorKeys: string[] = [];

  private _routeSubscr: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _cfr: ComponentFactoryResolver
  ) { }

  ngAfterViewInit() {
    const viewCompObs = this._route.data.pipe(
      distinctUntilKeyChanged('viewComp'),
      observeOn(asyncScheduler),
      tap(({viewComp}) => this._createViewComp(viewComp))
    );
    const playgroundsObs = this._route.data.pipe(
      distinctUntilKeyChanged('playgrounds'),
      map(({playgrounds}) => playgrounds)
    );
    const fragmentObs = combineLatest(playgroundsObs, this._route.fragment).pipe(
      map(([playgrounds, fragment]) => {
        if (!fragment) this._router.navigate(
          ['.'],
          {relativeTo: this._route, fragment: Object.keys(playgrounds)[0]}
        );
        playgrounds = typeof playgrounds === 'object' ? playgrounds : {};
        return typeof playgrounds[fragment] === 'object' ? playgrounds[fragment] : {};
      }),
      observeOn(asyncScheduler),
      tap(files => {
        this.models.next({});
        this.files = Object.keys(files).reduce(
          (acc, key) => [...acc, {schema: key, content: files[key]}],
          []
        );
        this.editorFile = this.files[0].schema;
      }),
    );
    this._routeSubscr = merge(viewCompObs, fragmentObs).subscribe(null, err => console.error(err));
  }

  ngOnDestroy() {
    this.models.unsubscribe();
    if (this._routeSubscr) this._routeSubscr.unsubscribe();
  }

  getEditorModel(fileKey: string) {
    return {schema: fileKey, content: this.files[fileKey]};
  }

  handleEditorChange(fileKey: string, e: EditorModel): void {
    if (e.valid) {
      if (this.errors.has(fileKey)) this.errors = this.errors.remove(fileKey);
      this.models.next({...this.models.value, [fileKey]: e.value});
    }
    else {
      if (this.models.value[fileKey]) {
        const models = {...this.models.value};
        delete models[fileKey];
        this.models.next(models);
      }
      this.errors = this.errors.set(fileKey, (e as InvalidEditorModel).errors);
    }
    this.errorKeys = this.errors.keySeq().toArray();
  }

  private _createViewComp(viewComp: any): void {
    if (!viewComp) throw new ReferenceError('Expected viewComp');
    if (!this.viewCompContainerRef) throw new ReferenceError('Expected viewCompContainerRef');
    this.viewCompContainerRef.clear();
    const compFactory = this._cfr.resolveComponentFactory(viewComp);
    const injector = Injector.create([
      {provide: ITM_DEMO_JSON_PLAYGROUND_MODELS, useValue: this.models}
    ]);
    this.viewCompContainerRef.createComponent(compFactory, null, injector);
  }
}
