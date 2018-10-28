import {
  Component,
  ComponentFactoryResolver,
  AfterViewInit,
  Inject,
  Injector,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Map } from 'immutable';

import { ITM_MENU_BUTTON_REFS } from './menu';
import { ItmButtonRef } from './button';
import ItmConfig from './config';

@Component({
  selector: 'itm-menu',
  template: '<ng-container #buttons></ng-container>'
})
export class ItmMenuComponent implements AfterViewInit {
  @ViewChild('buttons', {read: ViewContainerRef})
  buttonsContainerRef: ViewContainerRef;

  constructor(
    @Inject(ITM_MENU_BUTTON_REFS)
    private _buttonRefs: Map<string, ItmButtonRef>,
    private _config: ItmConfig,
    private _injector: Injector,
    private _componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngAfterViewInit() {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
      this._config.defaultButtonComp
    );
    this._buttonRefs.forEach(buttonRef => {
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
}
