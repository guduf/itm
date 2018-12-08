
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
import {
  asyncScheduler,
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  Subscription
} from 'rxjs';
import { map, tap, distinctUntilKeyChanged, observeOn, reduce, share } from 'rxjs/operators';

import { EditorModel, InvalidEditorModel } from './editor.service';
import { JsonEditorModel } from './json_editor.component';

// tslint:disable-next-line:max-line-length
export interface JsonPlaygroundView<F extends Object = {}> {
  playgrounds: { [fragment: string]: { files: F } };
  comp: any;
}

// tslint:disable-next-line:max-line-length
export interface JsonPlaygroundViewData<F extends Object = {}> {
  files: Observable<F>;
}

// tslint:disable-next-line:max-line-length
export const JSON_PLAYGROUND_VIEW_DATA = new InjectionToken<JsonPlaygroundView>('JSON_PLAYGROUND_VIEW_DATA');

@Component({
  selector: 'itm-demo-json-playground',
  templateUrl: 'json_playground.component.html',
  styleUrls: ['json_playground.component.scss']
})
// tslint:disable-next-line:max-line-length
export class JsonPlaygroundViewComponent<F = { grid: Object; target: Object; }> implements AfterViewInit, OnDestroy {
  files: JsonEditorModel[];

  @ViewChild('viewCompContainer', {read: ViewContainerRef})
  viewCompContainerRef: ViewContainerRef;

  editorFile: string;
  readonly models = new BehaviorSubject<F>({} as F);
  errors = Map<string, Object>();
  errorKeys: string[] = [];

  private _routeSubscr: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _cfr: ComponentFactoryResolver
  ) { }

  ngAfterViewInit() {
    const data = (this._route.data as Observable<{ playgroundView: JsonPlaygroundView }>).pipe(
      distinctUntilKeyChanged('playgroundView'),
      map(({playgroundView}) => playgroundView),
    );
    const viewCompObs = data.pipe(
      distinctUntilKeyChanged('comp'),
      observeOn(asyncScheduler),
      tap(({comp}) => this._createViewComp(comp))
    );
    const playgroundsObs = data.pipe(
      distinctUntilKeyChanged('playgrounds'),
      map(({playgrounds}) => playgrounds),
    );
    const fragmentObs = combineLatest(playgroundsObs, this._route.fragment).pipe(
      map(([playgrounds, fragment]) => {
        const files = Object.keys(playgrounds).reduce(
          (acc, key) => ({...acc, [key]: playgrounds[key].files}),
          {}
        );
        if (!fragment) this._router.navigate(
          ['.'],
          {relativeTo: this._route, fragment: Object.keys(files)[0]}
        );
        return typeof files[fragment] === 'object' ? files[fragment] : {};
      }),
      observeOn(asyncScheduler),
      tap(files => {
        this.models.next({} as F);
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
      this.models.next({...this.models.value as Object, [fileKey]: e.value} as F);
    }
    else {
      if (this.models.value[fileKey]) {
        const models = {...this.models.value as Object};
        delete models[fileKey];
        this.models.next(models as F);
      }
      this.errors = this.errors.set(fileKey, (e as InvalidEditorModel).errors);
    }
    this.errorKeys = this.errors.keySeq().toArray();
  }

  private _createViewComp(comp: any): void {
    if (!comp) throw new ReferenceError('Expected comp');
    if (!this.viewCompContainerRef) throw new ReferenceError('Expected compContainerRef');
    this.viewCompContainerRef.clear();
    const compFactory = this._cfr.resolveComponentFactory(comp);
    const viewData: JsonPlaygroundViewData<F> = {
      files: this.models.asObservable(),
    };
    const injector = Injector.create([
      {provide: JSON_PLAYGROUND_VIEW_DATA, useValue: viewData}
    ]);
    this.viewCompContainerRef.createComponent(compFactory, null, injector);
  }
}
