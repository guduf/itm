import { SimpleChange, ValueProvider, Directive, Input } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MatTableModule, MatTable, MatCell, MatHeaderCell } from '@angular/material';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { Itm, ItmsChanges } from './itm';
import { ItmColumnDef } from './column';
import { ItmTableConfig } from './table';
import { ItmTableComponent } from './table.component';

@Directive({selector: '[itmCell]'})
// tslint:disable-next-line:directive-class-suffix
export class ItmCellDirective<I extends Itm = Itm> {
  // tslint:disable-next-line:no-input-rename
  @Input('itmCell')
  column: ItmColumnDef;

  @Input()
  item: Itm;
}

@Directive({selector: '[itmHeaderCell]'})
// tslint:disable-next-line:directive-class-suffix
export class ItmHeaderCellDirective<I extends Itm = Itm> {
  // tslint:disable-next-line:no-input-rename
  @Input('itmHeaderCell')
  column: ItmColumnDef;

  @Input()
  itemsChanges: ItmsChanges<I>;
}

describe('ItmTableComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTableModule],
      declarations: [
        ItmCellDirective,
        ItmHeaderCellDirective,
        ItmTableComponent
      ]
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const {componentInstance} = TestBed.createComponent(ItmTableComponent);
    expect(componentInstance).toBeTruthy();
  }));

  it('should display a MatTable', async(() => {
    const {debugElement} = TestBed.createComponent(ItmTableComponent);
    const queryRes = debugElement.query(By.directive(MatTable));
    expect(queryRes).toBeTruthy('expected element that have the MatTable directive');
  }));

  function setupMinimalTableWithInputs(
    ...providers: ValueProvider[]
  ): ComponentFixture<ItmTableComponent> {
    for (const provider of providers)
      TestBed.overrideProvider(provider.provide, {useValue: provider.useValue});
    const fixture = TestBed.createComponent(ItmTableComponent);
    const {componentInstance} = fixture;
    const config: ItmTableConfig = {columns: ['id']};
    const previousValue = componentInstance.table;
    componentInstance.itemsChanges = of([{id: 42}]);
    componentInstance.table = config;
    const tableChange: SimpleChange = {
      previousValue,
      currentValue: componentInstance.table,
      firstChange: true,
      isFirstChange : () => true
    };
    componentInstance.ngOnChanges({table: tableChange});
    fixture.detectChanges();
    return fixture;
  }

  it('should display a MatCell with valid table config', async(() => {
    const {debugElement} = setupMinimalTableWithInputs();
    const debugMatCell = debugElement.query(By.directive(MatCell));
    expect(debugMatCell).toBeTruthy('Expected MatCell directive');
  }));

  it('should display a MatHeaderCell with valid table config', async(() => {
    const {debugElement} = setupMinimalTableWithInputs();
    const debugMatHeaderCell = debugElement.query(By.directive(MatHeaderCell));
    expect(debugMatHeaderCell).toBeTruthy('Expected MatHeaderCell directive');
  }));

  // tslint:disable-next-line:max-line-length
  it('should display a ItmCellDirective with valid table config', async(() => {
    const {debugElement} = setupMinimalTableWithInputs();
    const debugMatCell = debugElement.query(By.directive(MatCell));
    const providerToken = debugMatCell.childNodes[0].providerTokens[0];
    // tslint:disable-next-line:max-line-length
    expect(providerToken).toBe(ItmCellDirective, 'Expected ItmCellDirective as provider token of the first node of the first MatCell');
  }));

  // tslint:disable-next-line:max-line-length
  it('should display a ItmHeaderCellDirective with valid table config', async(() => {
    const {debugElement} = setupMinimalTableWithInputs();
    const debugMatHeaderCell = debugElement.query(By.directive(MatHeaderCell));
    const providerToken = debugMatHeaderCell.childNodes[0].providerTokens[0];
    // tslint:disable-next-line:max-line-length
    expect(providerToken).toBe(ItmHeaderCellDirective, 'Expected ItmHeaderCellDirective as provider token of the first node of the first MatHeaderCell');
  }));

  it('should remain columns untouched when itemChanges changes', async(() => {
    const fixture = setupMinimalTableWithInputs();
    const {componentInstance} = fixture;
    const {columns} = componentInstance;
    componentInstance.itemsChanges = of([]);
    componentInstance.ngOnChanges({});
    fixture.detectChanges();
    expect(componentInstance.columns).toBe(columns, 'Expected instance column identical');
  }));
});
