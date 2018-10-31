import {
  Component,
  ComponentFactoryResolver,
  AfterViewInit,
  Inject,
  Injector,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  HostBinding
} from '@angular/core';

import Menu, { ItmMenuRef } from './menu';
import { ItmButtonRef } from './button';
import ItmConfig from './config';
import { startWith } from 'rxjs/operators';

const SELECTOR = 'itm-menu';

@Component({
  selector: SELECTOR,
  template: '<ng-container #buttons></ng-container>'
})
export class ItmMenuComponent implements AfterViewInit, OnDestroy {
  @ViewChild('buttons', {read: ViewContainerRef})
  buttonsContainerRef: ViewContainerRef;

  @HostBinding('class')
  get hostClass(): string { return SELECTOR + (this._dir ? ` ${SELECTOR}-${this._dir}` : ''); }

  private readonly _dirSubscr = this._ref.direction.subscribe(
    dir => (this._dir = dir),
    err => console.error(err)
  );

  private _dir: Menu.Direction;

  constructor(
    private readonly _ref: ItmMenuRef,
    private readonly _config: ItmConfig,
    private readonly _injector: Injector,
    private readonly _componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngAfterViewInit() {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
      this._config.defaultButtonComp
    );
    this._ref.buttons.forEach(buttonRef => {
      const injector = Injector.create(
        [{provide: ItmButtonRef, useValue: buttonRef}],
        this._injector
      );
      try {
        // tslint:disable-next-line:max-line-length
        const componentRef = this.buttonsContainerRef.createComponent(componentFactory, null, injector);
        componentRef.changeDetectorRef.detectChanges();
      }
      catch (err) { console.error(err); }
    });
  }

  ngOnDestroy() { this._dirSubscr.unsubscribe(); }
}
