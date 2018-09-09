import { Component, ViewChild } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';

import { ItmDefaultCellMockComponent } from './cell.directive.spec';
import { ItmColumnDef } from './column';
import { ItmsChanges } from './item';
import { ItmConfig } from './config';
import { ItmHeaderCellDirective } from './header-cell.directive';

@Component({
  template: '<ng-container [itmHeaderCell]="column" [itemsChanges]="itemsChanges"></ng-container>'
})
export class ItmHeaderCellDirectiveHotTestComponent {
  @ViewChild(ItmHeaderCellDirective)
  itmHeaderCellDirective: ItmHeaderCellDirective;

  column = new ItmColumnDef({key: 'id'});

  itemsChanges: ItmsChanges = of([{id: 42}]);
}

describe('ItmHeaderCellDirective', () => {
  beforeEach(async(() => {
    const config: ItmConfig = {defaultHeaderCellComp: ItmDefaultCellMockComponent};
    TestBed.configureTestingModule({
      declarations: [
        ItmHeaderCellDirective,
        ItmHeaderCellDirectiveHotTestComponent,
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
    const {componentInstance} = TestBed.createComponent(ItmHeaderCellDirectiveHotTestComponent);
    expect(componentInstance.itmHeaderCellDirective).toBeTruthy();
  }));

  function setup(): ComponentFixture<ItmHeaderCellDirectiveHotTestComponent> {
    const fixture = TestBed.createComponent(ItmHeaderCellDirectiveHotTestComponent);
    fixture.componentInstance.itemsChanges = of([]);
    fixture.detectChanges();
    fixture.componentInstance.itmHeaderCellDirective.ngOnInit();
    return fixture;
  }

  it('should create the default cell component when no specified', async(() => {
    const {debugElement} = setup();
    expect(debugElement.query(By.directive(ItmDefaultCellMockComponent))).toBeTruthy();
  }));
});
