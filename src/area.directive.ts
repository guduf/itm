import {
  ComponentFactoryResolver,
  Injector,
  ViewContainerRef,
  Input,
  OnChanges,
  Directive,
  StaticProvider,
  ElementRef,
  Renderer2
} from '@angular/core';

import { ComponentType } from './utils';
import { Subscription, empty, Observable, isObservable } from 'rxjs';
import { ItmAreaText } from './area';
import { map, startWith, pairwise } from 'rxjs/operators';

/** Directive used by ItmGridComponent to build grid area. */
@Directive({selector: '[itmArea]'})
// tslint:disable-next-line:max-line-length
export class ItmAreaDirective implements OnChanges {
  /**
   * The reference that contains data needed to create the area component.
   * The view container is cleaned at each changes and a new component is created.
   */
  // tslint:disable-next-line:no-input-rename
  @Input('itmArea')
  areaRef: { comp: ComponentType, providers: StaticProvider[] };

  private readonly _parentNode: string;
  private _textEl: HTMLParagraphElement;
  private _textSubscr: Subscription;

  constructor(
    hostRef: ElementRef,
    private readonly _injector: Injector,
    private readonly _componentFactoryResolver: ComponentFactoryResolver,
    private readonly _viewContainerRef: ViewContainerRef,
    private readonly _renderer: Renderer2
  ) {
    this._parentNode = this._renderer.parentNode(hostRef.nativeElement);
  }

  ngOnChanges() {
    this._viewContainerRef.clear();
    if (this._textSubscr) this._textSubscr.unsubscribe();
    if (this._textEl) {
      this._renderer.removeChild(this._parentNode, this._textEl);
      this._textEl = null;
    }
    if (!this.areaRef || typeof this.areaRef !== 'object') return;
    const {comp, providers} = this.areaRef;
    const injector = Injector.create(providers, this._injector);
    if (!comp) {
      const pipe: Observable<string> = injector.get(ItmAreaText);
      if (!isObservable(pipe)) return;
      this._textEl = this._renderer.createElement('span');
      this._renderer.appendChild(this._parentNode, this._textEl);
      this._textSubscr = pipe
        .pipe(
          map(text => this._renderer.createText(text)),
          startWith(null),
          pairwise()
        )
        .subscribe(
          ([prev, next]) => {
            if (prev) this._renderer.removeChild(this._textEl, prev);
            this._renderer.appendChild(this._textEl, next);
          },
          err => console.error(err)
        );
      return;
    }
    this._textEl = null;
    this._textSubscr = null;
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(comp);
    try { this._viewContainerRef.createComponent(componentFactory, null, injector); }
    catch (err) {
      console.error(err);
    }
  }
}

