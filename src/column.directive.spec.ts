import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { ItmColumnCellDirective } from './column.directive';
import { ItmColumnDef } from './column';
import { Itm } from './item';
import { ItmConfig } from './config';

@Component({template: ''})
export class ItmColumnCellTestComponent {
  constructor(public item: Itm, public column: ItmColumnDef) { }
}

@Component({template: ''})
export class ItmTextAreaMockComponent {
  constructor(public target: Itm, public column: ItmColumnDef) { }
}

@Component({
  template: `
    <ng-container itmColumnCell
      [area]="defaultColumn"
      [item]="item"></ng-container>
  `
})
export class ItmColumnCellDirectiveHotTestComponent {
  @ViewChild(ItmColumnCellDirective)
  itmCellDirective: ItmColumnCellDirective;
  readonly columnWithComp = new ItmColumnDef({key: 'id', cell: ItmColumnCellTestComponent});
  readonly defaultColumn = new ItmColumnDef({key: 'id'});
  readonly item: Itm = {id: 42};
}

describe('ItmColumnCellDirective', () => {
  beforeEach(async(() => {
    const config: ItmConfig = {
      defaultTextAreaComp: ItmTextAreaMockComponent
    };
    TestBed
      .configureTestingModule({
        declarations: [
          ItmColumnCellDirective,
          ItmColumnCellDirectiveHotTestComponent,
          ItmColumnCellTestComponent,
          ItmTextAreaMockComponent,
        ],
        providers: [{provide: ItmConfig, useValue: config}]
      })
      .overrideModule(
        BrowserDynamicTestingModule,
        {set: {entryComponents: [ItmTextAreaMockComponent, ItmColumnCellTestComponent]}
      });
  }));

  it('should create the directive', async(() => {
    TestBed.compileComponents();
    const {componentInstance} = TestBed.createComponent(ItmColumnCellDirectiveHotTestComponent);
    expect(componentInstance.itmCellDirective).toBeTruthy();
  }));

  function setup(
    hotTestComponentTemplate?: string,
  ): ComponentFixture<ItmColumnCellDirectiveHotTestComponent> {
    if (hotTestComponentTemplate)
      TestBed.overrideTemplate(ItmColumnCellDirectiveHotTestComponent, hotTestComponentTemplate);
    TestBed.compileComponents();
    const fixture = TestBed.createComponent(ItmColumnCellDirectiveHotTestComponent);
    fixture.detectChanges();
    fixture.componentInstance.itmCellDirective.ngOnInit();
    return fixture;
  }

  it('should create the default cell component when no specified', async(() => {
    const {debugElement} = setup();
    expect(debugElement.query(By.directive(ItmTextAreaMockComponent))).toBeTruthy();
  }));

  it('should throw a error when initiated with missing inputs', async(() => {
    const fun = () => setup(
      '<ng-container itmColumnCell [area]="null" [item]="null"></ng-container>'
    );
    expect(fun).toThrowError(TypeError);
  }));

  it('should provide correct Itm and ItmColumnDef in cell component injector', async(() => {
    const {debugElement} = setup(
      '<ng-container itmColumnCell [area]="columnWithComp" [item]="item"></ng-container>'
    );
    const debugCell = debugElement.query(By.directive(ItmColumnCellTestComponent));
    expect(debugCell).toBeTruthy();
    const cellInstance: ItmColumnCellTestComponent = debugCell.componentInstance;
    const hostInstance: ItmColumnCellDirectiveHotTestComponent = debugElement.componentInstance;
    expect(cellInstance.column).toBe(hostInstance.columnWithComp);
    expect(cellInstance.item).toBe(hostInstance.item);
  }));
});
