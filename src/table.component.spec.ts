import { SimpleChange, ValueProvider, Directive, Input } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MatTable, MatCell, MatHeaderCell } from '@angular/material';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { Itm, ItmsChanges, Itms } from './itm';
import { ItmColumnDef } from './column-def';
import { ItmTableConfig } from './table-config';
import { ItmTableComponent } from './table.component';
import { ItmMaterialModule } from './material.module';
import { click } from './helpers.spec';

@Directive({selector: '[itmCell]'})
// tslint:disable-next-line:directive-class-suffix
export class ItmCellDirective<I extends Itm = Itm> {
  @Input()
  column: ItmColumnDef;

  // tslint:disable-next-line:no-input-rename
  @Input('itmCell')
  item: Itm;
}

@Directive({selector: '[itmHeaderCell]'})
// tslint:disable-next-line:directive-class-suffix
export class ItmHeaderCellDirective<I extends Itm = Itm> {
  @Input()
  column: ItmColumnDef;

  // tslint:disable-next-line:no-input-rename
  @Input('itmHeaderCell')
  itemsChanges: ItmsChanges<I>;
}

describe('ItmTableComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ItmMaterialModule],
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

  function setupTable<I extends Itm = Itm>(
    config: ItmTableConfig<I> = {columns: ['id']},
    itemsChanges: ItmsChanges<I> = of([{id: 63} as I]),
    providers: ValueProvider[] = []
  ): ComponentFixture<ItmTableComponent<I>> {
    for (const provider of providers)
      TestBed.overrideProvider(provider.provide, {useValue: provider.useValue});
    const fixture = TestBed.createComponent<ItmTableComponent<I>>(ItmTableComponent);
    const {componentInstance} = fixture;
    const {itemsChanges: previousItemsChanges, table: previousTable} = componentInstance;
    componentInstance.itemsChanges = itemsChanges;
    const itemChangesChanges: SimpleChange = {
      previousValue: previousItemsChanges,
      currentValue: componentInstance.itemsChanges,
      firstChange: true,
      isFirstChange : () => true
    };
    componentInstance.table = config;
    const tableChange: SimpleChange = {
      previousValue: previousTable,
      currentValue: componentInstance.table,
      firstChange: true,
      isFirstChange : () => true
    };
    componentInstance.ngOnChanges({table: tableChange, itemChanges: itemChangesChanges});
    fixture.detectChanges();
    return fixture;
  }

  it('should display a MatCell with valid table config', async(() => {
    const {debugElement} = setupTable();
    const debugMatCell = debugElement.query(By.directive(MatCell));
    expect(debugMatCell).toBeTruthy('Expected MatCell directive');
  }));

  it('should display a MatHeaderCell with valid table config', async(() => {
    const {debugElement} = setupTable();
    const debugMatHeaderCell = debugElement.query(By.directive(MatHeaderCell));
    expect(debugMatHeaderCell).toBeTruthy('Expected MatHeaderCell directive');
  }));

  // tslint:disable-next-line:max-line-length
  it('should display a ItmCellDirective with valid table config', async(() => {
    const {debugElement} = setupTable();
    const debugMatCell = debugElement.query(By.directive(MatCell));
    const providerToken = debugMatCell.childNodes[0].providerTokens[0];
    // tslint:disable-next-line:max-line-length
    expect(providerToken).toBe(ItmCellDirective, 'Expected ItmCellDirective as provider token of the first node of the first MatCell');
  }));

  // tslint:disable-next-line:max-line-length
  it('should display a ItmHeaderCellDirective with valid table config', async(() => {
    const {debugElement} = setupTable();
    const debugMatHeaderCell = debugElement.query(By.directive(MatHeaderCell));
    const providerToken = debugMatHeaderCell.childNodes[0].providerTokens[0];
    // tslint:disable-next-line:max-line-length
    expect(providerToken).toBe(ItmHeaderCellDirective, 'Expected ItmHeaderCellDirective as provider token of the first node of the first MatHeaderCell');
  }));

  it('should remain columns untouched when itemChanges changes', async(() => {
    const fixture = setupTable();
    const {componentInstance} = fixture;
    const {columns} = componentInstance;
    componentInstance.itemsChanges = of([]);
    componentInstance.ngOnChanges({});
    fixture.detectChanges();
    expect(componentInstance.columns).toBe(columns, 'Expected instance column identical');
  }));

  it('should remain columns untouched when itemChanges changes', async(() => {
    const fixture = setupTable();
    const {componentInstance} = fixture;
    const {columns} = componentInstance;
    componentInstance.itemsChanges = of([]);
    componentInstance.ngOnChanges({});
    expect(componentInstance.columns).toBe(columns, 'Expected instance column identical');
  }));

  it('should show the selection column as first if the canSelect is true', async(() => {
    const fixture = setupTable({columns: ['id'], canSelect: true});
    const debugMatCell = fixture.debugElement.query(By.directive(MatCell));
    const matCellElem: HTMLTableCellElement = debugMatCell.nativeElement;
    expect(matCellElem.classList.contains('mat-column-itm-selection')).toBeTruthy();
    expect(debugMatCell.query(By.css('button'))).toBeTruthy();
  }));

  it('should toggle the item selection when clicking on the right selection button', async(() => {
    const data: Itms = [{id: 63}];
    const fixture = setupTable({columns: ['id'], canSelect: true}, of(data));
    const debugSelectionButton = fixture.debugElement
      .query(By.directive(MatCell))
      .query(By.css('button'));
    expect(fixture.componentInstance.selection.size).toBe(0);
    click(debugSelectionButton);
    fixture.detectChanges();
    expect(fixture.componentInstance.selection.size).toBe(1);
    expect(fixture.componentInstance.selection.has(data[0])).toBe(true);
    click(debugSelectionButton);
    fixture.detectChanges();
    expect(fixture.componentInstance.selection.size).toBe(0);
  }));

  it('should not create the selection button if the item is not selectable', async(() => {
    const fixture = setupTable<{ id: number; isSelectable: boolean; }>(
      {columns: ['isSelectable'], canSelect: itm => itm.isSelectable},
      of([
        {id: 63, isSelectable: true},
        {id: 64, isSelectable: false}
      ])
    );
    const debugMatCells = fixture.debugElement.queryAll(By.directive(MatCell));
    expect(debugMatCells[0].query(By.css('button'))).toBeTruthy();
    expect(debugMatCells[1].query(By.css('button'))).toBeFalsy();
  }));
});
