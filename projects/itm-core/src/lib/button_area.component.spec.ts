import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { of, BehaviorSubject } from 'rxjs';

import { ItmAreaText } from './area';
import { ItmButtonRef } from './button';
import ButtonAreaFactory from './button_area_factory';
import { ItmButtonAreaComponent } from './button_area.component';
import ActionEmitter from './action_emitter';

describe('ItmButtonAreaComponent', () => {
  const button = ButtonAreaFactory({key: 'save'});
  const target = new BehaviorSubject({id: 63});
  const buttonRef = new ItmButtonRef(button, target, new ActionEmitter(target));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatIconModule
      ],
      declarations: [
        ItmButtonAreaComponent
      ],
      providers: [
        {provide: ItmAreaText, useValue: of('test')},
        {provide: ItmButtonRef, useValue: buttonRef}
      ]
    });
    TestBed.compileComponents();
  }));

  function setup(): ComponentFixture<ItmButtonAreaComponent> {
    return TestBed.createComponent(ItmButtonAreaComponent);
  }

  it('should initialize', () => {
    expect(setup()).toBeTruthy();
  });
});
