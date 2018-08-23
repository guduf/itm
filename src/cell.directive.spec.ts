import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { ItmCellDirective } from './cell.directive';
import { ItmColumnDef } from './column';
import { Itm } from './itm';
import { ItmConfig } from './itm-config';

@Component({template: '<ng-container [itmCell]="column" [item]="item"></ng-container>'})
export class ItmCellDirectiveHotTestComponent {
  @ViewChild(ItmCellDirective)
  itmCellDirective: ItmCellDirective;
  column = new ItmColumnDef({key: 'id'});
  itm: Itm = {id: 42};
}

@Component({template: ''})
export class ItmDefaultCellMockComponent { }

@Component({template: ''})
export class TestCellComponent { }

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
          TestCellComponent,
          ItmDefaultCellMockComponent
        ],
        providers: [{provide: ItmConfig, useValue: config}]
      })
      .overrideModule(
        BrowserDynamicTestingModule,
        {set: {entryComponents: [ItmDefaultCellMockComponent]}
      })
      .compileComponents();
  }));

  it('should create the directive', async(() => {
    const {componentInstance} = TestBed.createComponent(ItmCellDirectiveHotTestComponent);
    expect(componentInstance.itmCellDirective).toBeTruthy();
  }));

  function setup(): ComponentFixture<ItmCellDirectiveHotTestComponent> {
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
});
