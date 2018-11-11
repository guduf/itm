import { Component } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

import ActionEmitter from './action_emitter';
import { ItmMenuRef } from './menu';
import { ItmMenuComponent } from './menu.component';
import MenuFactory from './menu_factory';
import { ITM_OPTIONS } from './options';

describe('ItmMenuComponent', () => {
  @Component({template: ''})
  class ButtonMockComponent { }

  const menu = MenuFactory({key: 'menu', buttons: [{key: 'save'}]});
  const target = new BehaviorSubject({id: 63});
  const menuRef = new ItmMenuRef(menu, target, new ActionEmitter(target));
  const opts = new BehaviorSubject({defaultButtonComp: ButtonMockComponent});

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatIconModule
      ],
      declarations: [
        ItmMenuComponent
      ],
      providers: [
        {provide: ItmMenuRef, useValue: menuRef},
        {provide: ITM_OPTIONS, useValue: opts}
      ]
    });

    TestBed.overrideModule(
      BrowserDynamicTestingModule,
      {set: {declarations: [ButtonMockComponent], entryComponents: [ButtonMockComponent]}}
    );

    TestBed.compileComponents();
  }));

  it('should initialize', () => {
    const fixture = TestBed.createComponent(ItmMenuComponent);
    expect(fixture).toBeTruthy();
  });
});
