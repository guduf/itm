import {
  ComponentFactoryResolver,
  Directive,
  Injectable,
  Injector,
  Input,
  OnInit,
  ViewContainerRef,
  StaticProvider
} from '@angular/core';

import { ItmColumn } from './column';
import { ItmDefaultCellComponent } from './default-cell.component';
import { ItmDefaultHeaderCellComponent } from './default-header-cell.component';
import { Itm, ItmsChanges } from './itm';
import { CmpClass } from './utils';

@Injectable()
abstract class AbstactItmCellDirective<I extends Itm = Itm> implements OnInit {
  /** The column of the cell. */
  column: ItmColumn;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _injector: Injector
  ) { }

  ngOnInit() {
    const providers: StaticProvider[] = [
      {provide: ItmColumn, useValue: this.column},
      ...this._loadProviders()
    ];
    const cmpClass: CmpClass = (
      this instanceof ItmCellDirective ?
        this.column.cell || ItmDefaultCellComponent :
        this.column.header || ItmDefaultHeaderCellComponent
    );
    const injector = Injector.create(providers, this._injector);
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(cmpClass);
    this._viewContainerRef.createComponent(componentFactory, null, injector);
  }

  /** Add providers to injector of the cell component. */
  protected abstract _loadProviders(): StaticProvider[];
}

@Directive({selector: '[itmCell]'})
export class ItmCellDirective<I extends Itm = Itm> extends AbstactItmCellDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('itmCell')
  column: ItmColumn;

  @Input()
  /** The item of the cell. */
  item: Itm;

  _loadProviders(): StaticProvider[] {
    return [
      {provide: Itm, useValue: this.item}
    ];
  }
}

@Directive({selector: '[itmHeaderCell]'})
export class ItmHeaderCellDirective<I extends Itm = Itm> extends AbstactItmCellDirective<I> {
  // tslint:disable-next-line:no-input-rename
  @Input('itmHeaderCell')
  column: ItmColumn;

  @Input()
  /** The items changes of the table. */
  itemsChanges: ItmsChanges<I>;

  _loadProviders(): StaticProvider[] {
    return [
      {provide: ItmsChanges, useValue: this.itemsChanges}
    ];
  }
}
