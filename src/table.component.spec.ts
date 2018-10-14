// tslint:disable:max-line-length
import { ValueProvider, Directive, Input, Component, StaticProvider } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MatTable, MatCell, MatHeaderCell } from '@angular/material';
import { By } from '@angular/platform-browser';
import { Map } from 'immutable';
import { of, BehaviorSubject } from 'rxjs';

import { Itm, ItmsSource } from './item';
import Area from './area';
import Column from './column';
import Table from './table';
import { ItmTableComponent } from './table.component';
import { ItmMaterialModule } from './material.module';
import { click, changeInputs } from './helpers.spec';
import { ItmConfig } from './config';
import { DEFAULT_CONFIG } from './itm.module';
import ActionEvent from './action-event';
import { ItmAreaDirective, ITM_AREA_FACTORY_MAP_TOKEN } from './area.directive';
import { ItmTextAreaComponent } from './text-area.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ItmActionsAreaComponent } from './actions-area.component';
import { ItmButtonsComponent } from './buttons.component';
import { ItmButtonComponent } from './button.component';

@Directive({selector: '[itmArea]'})
// tslint:disable-next-line:directive-class-suffix
class ItmAreaMockDirective<T = {}> {
  // tslint:disable-next-line:no-input-rename
  @Input('itmArea')
  area: Area;

  /** The emitter of action events. */
  @Input()
  action: ActionEvent.Emitter<T>;

  @Input()
  target: T;

  @Input()
  providers: StaticProvider[];
}

@Component({selector: 'itm-table-settings', template: ''})
class ItmTableSettingsComponent {
  @Input()
  table: ItmTableComponent;
}

describe('ItmTableComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ItmMaterialModule
      ],
      declarations: [
        ItmAreaMockDirective,
        ItmTableComponent,
        ItmTableSettingsComponent,
        ItmAreaDirective,
        ItmTextAreaComponent,
        ItmActionsAreaComponent,
        ItmButtonsComponent,
        ItmButtonComponent
      ],
      providers: [
        {provide: ItmConfig, useValue: DEFAULT_CONFIG},
        {provide: ITM_AREA_FACTORY_MAP_TOKEN, useValue: Map({area: Area.factory, column: Column.factory})}
      ]
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ItmTextAreaComponent, ItmActionsAreaComponent]
      }
    });
    TestBed.compileComponents();
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
    table: Table.Config<I> = {columns: [{key: 'id'}]},
    itemsSource: ItmsSource<I> = [{id: 63} as I],
    providers: ValueProvider[] = []
  ): ComponentFixture<ItmTableComponent<I>> {
    for (const provider of providers)
      TestBed.overrideProvider(provider.provide, {useValue: provider.useValue});
    const fixture = TestBed.createComponent<ItmTableComponent<I>>(ItmTableComponent);
    changeInputs(fixture, {itemsSource, table});
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
    expect(providerToken).toBe(ItmAreaMockDirective, 'Expected AreaDirective as provider token of the first node of the first MatCell');
  }));

  // tslint:disable-next-line:max-line-length
  it('should display a ItmHeaderCellDirective with valid table config', async(() => {
    const {debugElement} = setupTable();
    const debugMatHeaderCell = debugElement.query(By.directive(MatHeaderCell));
    const providerToken = debugMatHeaderCell.childNodes[0].providerTokens[0];
    expect(providerToken).toBe(ItmAreaMockDirective, 'Expected AreaDirective as provider token of the first node of the first MatHeaderCell');
  }));

  it('should remain columns untouched when itemChanges changes', async(() => {
    const fixture = setupTable();
    const {componentInstance} = fixture;
    const {columns} = componentInstance;
    componentInstance.itemsSource = [];
    componentInstance.ngOnChanges({});
    fixture.detectChanges();
    expect(componentInstance.columns).toBe(columns, 'Expected instance column identical');
  }));

  it('should assign the expected class to the row', async(() => {
    const expectedClass = 'qui-harum-sit';
    const selectedClass = 'itm-row-selected';
    const fixture = setupTable({columns: [{key: 'id'}]});
    const rowEl: HTMLTableRowElement = fixture.debugElement.query(By.css('tr.itm-row')).nativeElement;
    expect(rowEl.classList.contains(expectedClass)).toBeFalsy('Expected not contains the class for round0');

    changeInputs(fixture, {table: {columns: [{key: 'id'}], setRowClass: () => expectedClass}});
    expect(rowEl.classList.contains(expectedClass)).toBeTruthy('Expected contains the class for round1');

    const secondClass = 'sed-modi-culpa';
    const subject = new BehaviorSubject(secondClass);
    const fetcher = () => subject;
    changeInputs(fixture, {table: {columns: [{key: 'id'}], setRowClass: fetcher}});
    expect(rowEl.classList.contains(expectedClass)).toBeFalsy('Expected not contains the first class for round2');
    expect(rowEl.classList.contains(secondClass)).toBeTruthy('Expected contains the second class for round3');

    subject.next('');
    fixture.detectChanges();
    expect(rowEl.classList.contains(secondClass)).toBeFalsy('Expected not contains the second class for round3');

    changeInputs(fixture, {table: {columns: [{key: 'id'}], setRowClass: fetcher, canSelect: true}});
    expect(rowEl.classList.contains(selectedClass)).toBeFalsy('Expected not contains the selected class for round4');

    fixture.componentInstance.toggleAllSelection();
    fixture.detectChanges();
  }));

  it('should show the selection column as first when canSelect is true', async(() => {
    const fixture = setupTable({columns: [{key: 'id'}], canSelect: true});
    const debugMatCell = fixture.debugElement.query(By.directive(MatCell));
    const matCellElem: HTMLTableCellElement = debugMatCell.nativeElement;
    expect(matCellElem.classList.contains('itm-selection-cell')).toBeTruthy();
    expect(debugMatCell.query(By.css('button'))).toBeTruthy();
  }));

  it('should hide the selection column if the canSelect is false', async(() => {
    const fixture = setupTable({columns: [{key: 'id'}], canSelect: false});
    const debugMatCell = fixture.debugElement.query(By.directive(MatCell));
    const matCellElem: HTMLTableCellElement = debugMatCell.nativeElement;
    expect(matCellElem.classList.contains('itm-selection-cell')).toBeFalsy();
  }));

  it('should toggle the item selection when clicking on the selection button', async(() => {
    const itemSource: Itm[] = [{id: 63}];
    const fixture = setupTable({columns: [{key: 'id'}], canSelect: true}, itemSource);
    const debugSelectionButton = fixture.debugElement
      .query(By.directive(MatCell))
      .query(By.css('button'));
    expect(fixture.componentInstance.selection.size).toBe(0);

    click(debugSelectionButton);
    fixture.detectChanges();
    expect(fixture.componentInstance.selection.size).toBe(1);
    expect(fixture.componentInstance.selection.has(itemSource[0])).toBe(true);

    click(debugSelectionButton);
    fixture.detectChanges();
    expect(fixture.componentInstance.selection.size).toBe(0);
  }));

  it('should not disable the selection button if the item is not selectable', async(() => {
    const fixture = setupTable<{ id: number; isSelectable: boolean; }>(
      {columns: [{key: 'isSelectable'}], canSelect: itm => itm.isSelectable},
      of([
        {id: 63, isSelectable: true},
        {id: 64, isSelectable: false}
      ])
    );
    const debugMatCells = fixture.debugElement.queryAll(By.directive(MatCell));
    expect(debugMatCells[0].query(By.css('button'))).toBeTruthy();
    expect(debugMatCells[1].query(By.css('button'))).toBeFalsy();
  }));

  it('should toggle selection and icon on button click', async(() => {
    const testItem = {id: 63};
    const fixture = setupTable({columns: [{key: 'id'}], canSelect: true}, [testItem]);
    const debugMatCell = fixture.debugElement.query(By.directive(MatCell));
    const debugButton = debugMatCell.query(By.css('button'));
    expect(fixture.componentInstance.selection.size).toBeFalsy('Expected empty selection after start');

    click(debugButton);
    fixture.detectChanges();
    const selection = fixture.componentInstance.selection;
    expect(selection.size === 1).toBeTruthy('Expected selection with only one item after the first click');
    expect(selection.has(testItem)).toBeTruthy('Expected selection has the data source item after the first click');

    click(debugButton);
    fixture.detectChanges();
    expect(fixture.componentInstance.selection.size).toBeFalsy('Expected empty selection after the second click');
  }));

  it('should disable the selection cell button when the item is not toggable', async(() => {
    const data = [{id: 63}, {id: 64}, {id: 65}];
    const fixture = setupTable({columns: [{key: 'id'}], canSelect: true, selectionLimit: 2}, data);

    function getDisabledProperties(): boolean[] {
      return fixture.debugElement
        .queryAll(By.css('td.itm-selection-cell'))
        .map(debugButton => {
          const isDisabled = debugButton.query(By.css('button')).properties['disabled'];
          expect(isDisabled).toBeDefined('Expected disabled property on button');
          return isDisabled;
        });
    }

    const round1 = getDisabledProperties();
    expect(round1.reduce((acc, val) => acc || val, false)).toBeFalsy('Expected all buttons enabled for round 1');

    changeInputs(fixture, {table: {columns: [{key: 'id'}], canSelect: ({id}) => (id === 63)}});
    const round2 = getDisabledProperties();
    expect(round2[0]).toBeFalsy('Expected first button enabled for round 2');
    expect(round2.slice(1).reduce((acc, val) => acc && val, true)).toBeTruthy('Expected second and third buttons disabled for round 2');

    changeInputs(fixture, {table: {columns: [{key: 'id'}], canSelect: ({id}) => (id < 65), selectionLimit: 1}});
    const round3 = getDisabledProperties();
    expect(round3[2]).toBeTruthy('Expected third button disabled for round 3');
    expect(round3.slice(0, 2).reduce((acc, val) => acc || val, false)).toBeFalsy('Expected first and second buttons enabled for round 3');

    fixture.componentInstance.toggleItemSelection(data[1]);
    fixture.detectChanges();
    const round4 = getDisabledProperties();
    expect(round4[1]).toBeFalsy('Expected second button enabled for round 4');
    expect(round4[0] && round4[2]).toBeTruthy('Expected first and third buttons disabled for round 4');
  }));


  it('should toggle the selectable items when one pipe of the emits', async(() => {
    const subject = new BehaviorSubject(true);
    const fixture = setupTable({columns: [{key: 'id'}], canSelect: () => subject});
    const debugButton = fixture.debugElement.query(By.directive(MatCell)).query(By.css('button'));
    const round1 = debugButton.properties['disabled'];
    expect(round1).toBeDefined('Expected disabled property on button for round 1');
    expect(round1).toBeFalsy('Expected enabled button for round 1');
    subject.next(false);
    fixture.detectChanges();

    const round2 = debugButton.properties['disabled'];
    expect(round2).toBeDefined('Expected disabled property on butto for round 2n');
    expect(round2).toBeTruthy('Expected disabled button for round 2');
  }));

  it('should set the right icons and class when selection changes', async(() => {
    const {selectedCheckBoxIcon, unselectedCheckBoxIcon, indeterminateCheckBoxIcon} = DEFAULT_CONFIG;
    const fixture = setupTable({columns: [{key: 'id'}], canSelect: true}, [{id: 63}, {id: 64}]);
    const {componentInstance: tableInstance} = fixture;
    function getElements() {
      const headerButtonElem = fixture.debugElement.query(By.css('th.itm-selection-header-cell > button')).nativeElement as HTMLButtonElement;
      const buttonElems = fixture.debugElement.queryAll(By.css('td.itm-selection-cell > button')).map(el => el.nativeElement as HTMLButtonElement);
      const rowElems = fixture.debugElement.queryAll(By.css('tr.itm-row')).map(el => el.nativeElement as HTMLTableRowElement);
      return {headerButtonElem, buttonElems, rowElems};
    }

    const round0 = getElements();
    expect(round0.headerButtonElem.textContent).toContain(unselectedCheckBoxIcon, 'Expected header button unchecked for round0');
    expect(round0.buttonElems[0].textContent).toContain(unselectedCheckBoxIcon, 'Expected first button button unchecked for round0');
    expect(round0.rowElems[0].classList.contains('itm-row-selected')).toBeFalsy('Expected first row not selected for round0');
    expect(round0.buttonElems[1].textContent).toContain(selectedCheckBoxIcon, 'Expected second button button unchecked for round0');
    expect(round0.rowElems[1].classList.contains('itm-row-selected')).toBeFalsy('Expected second row not selected for round0');

    tableInstance.toggleItemSelection(tableInstance.items[0]);
    fixture.detectChanges();

    const round1 = getElements();
    expect(round1.headerButtonElem.textContent).toContain(indeterminateCheckBoxIcon, 'Expected header button inderminate for round1');
    expect(round1.buttonElems[0].textContent).toContain(selectedCheckBoxIcon, 'Expected first button button checked for round1');
    expect(round1.rowElems[0].classList.contains('itm-row-selected')).toBeTruthy('Expected first row selected for round1');
    expect(round1.buttonElems[1].textContent).toContain(selectedCheckBoxIcon, 'Expected second button button unchecked for round1');
    expect(round1.rowElems[1].classList.contains('itm-row-selected')).toBeFalsy('Expected second row not selected for round1');

    tableInstance.toggleItemSelection(tableInstance.items[1]);
    fixture.detectChanges();

    const round2 = getElements();
    expect(round2.headerButtonElem.textContent).toContain(selectedCheckBoxIcon, 'Expected header button checked for round2');
    expect(round2.buttonElems[0].textContent).toContain(selectedCheckBoxIcon, 'Expected first button button checked for round2');
    expect(round2.rowElems[0].classList.contains('itm-row-selected')).toBeTruthy('Expected first row selected for round2');
    expect(round2.buttonElems[1].textContent).toContain(selectedCheckBoxIcon, 'Expected second button button checked for round2');
    expect(round2.rowElems[1].classList.contains('itm-row-selected')).toBeTruthy('Expected second row selected for round2');

  }));
});
