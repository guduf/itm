import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { ItmCellDirective } from './cell.directive';
import { ItmColumnDef } from './column-def';
import { Itm } from './itm';
import { ItmConfig } from './itm-config';

@Component({template: ''})
export class ItmCellMockComponent {
  constructor(public itm: Itm, public column: ItmColumnDef) { }
}

@Component({template: ''})
export class ItmDefaultCellMockComponent { }

@Component({template: '<ng-container [itmCell]="item" [column]="defaultColumn"></ng-container>'})
export class ItmCellDirectiveHotTestComponent {
  @ViewChild(ItmCellDirective)
  itmCellDirective: ItmCellDirective;
  readonly columnWithComp = new ItmColumnDef({key: 'id', cell: ItmCellMockComponent});
  readonly defaultColumn = new ItmColumnDef({key: 'id'});
  readonly itm: Itm = {id: 42};
}

describe('ItmCellDirective', () => {
  beforeEach(async(() => {
    const config: ItmConfig = {
      defaultCellComp: ItmDefaultCellMockComponent
    };
    TestBed
      .configureTestingModule({
        declarations: [
          ItmCellDirective,
          ItmCellDirectiveHotTestComponent,
          ItmCellMockComponent,
          ItmDefaultCellMockComponent,
        ],
        providers: [{provide: ItmConfig, useValue: config}]
      })
      .overrideModule(
        BrowserDynamicTestingModule,
        {set: {entryComponents: [ItmCellMockComponent, ItmDefaultCellMockComponent]}
      });
  }));

  it('should create the directive', async(() => {
    TestBed.compileComponents();
    const {componentInstance} = TestBed.createComponent(ItmCellDirectiveHotTestComponent);
    expect(componentInstance.itmCellDirective).toBeTruthy();
  }));

  function setup(
    hotTestComponentTemplate?: string,
  ): ComponentFixture<ItmCellDirectiveHotTestComponent> {
    if (hotTestComponentTemplate)
      TestBed.overrideTemplate(ItmCellDirectiveHotTestComponent, hotTestComponentTemplate);
    TestBed.compileComponents();
    const fixture = TestBed.createComponent(ItmCellDirectiveHotTestComponent);
    fixture.detectChanges();
    fixture.componentInstance.itmCellDirective.ngOnInit();
    return fixture;
  }

  it('should create the default cell component when no specified', async(() => {
    const {debugElement} = setup();
    expect(debugElement.query(By.directive(ItmDefaultCellMockComponent))).toBeTruthy();
  }));

  it('should throw a error when initiated with missing inputs', async(() => {
    const {componentInstance} = TestBed.createComponent(ItmCellDirectiveHotTestComponent);
    const itmCellDir = componentInstance.itmCellDirective;
    expect(() => itmCellDir.ngOnInit()).toThrowError(TypeError);
  }));

  it('should provide a Itm and a ItmColumnDef in cell component provider', async(() => {
    const {debugElement} = setup(
      '<ng-container [itmCell]="item" [column]="columnWithComp"></ng-container>'
    );
    expect(debugElement.query(By.directive(ItmCellMockComponent))).toBeTruthy();
  }));
});
