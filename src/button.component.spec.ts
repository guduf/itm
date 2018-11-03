import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { of, BehaviorSubject } from 'rxjs';

import { ItmAreaText } from './area';
import Button, { ItmButtonRef } from './button';
import { ItmButtonComponent } from './button.component';
import ActionEmitter from './action_emitter';

describe('ItmButtonComponent', () => {
  const button = Button.factory.serialize({key: 'save'});
  const target = new BehaviorSubject({id: 63});
  const buttonRef = new ItmButtonRef(button, target, new ActionEmitter(target));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatIconModule
      ],
      declarations: [
        ItmButtonComponent
      ],
      providers: [
        {provide: ItmAreaText, useValue: of('test')},
        {provide: ItmButtonRef, useValue: buttonRef}
      ]
    });
    TestBed.compileComponents();
  }));

  function setup(): ComponentFixture<ItmButtonComponent> {
    return TestBed.createComponent(ItmButtonComponent);
  }

  it('should initialize', () => {
    expect(setup()).toBeTruthy();
  });
});
