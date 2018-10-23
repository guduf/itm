import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { of, BehaviorSubject } from 'rxjs';

import { ItmAreaText } from './area';
import Button, { ItmButtonRef } from './button';
import { ItmButtonComponent } from './button.component';

describe('ItmButtonComponent', () => {
  const button = Button.factory.serialize({key: 'save'});

  const buttonRef = new ItmButtonRef(
    button,
    new BehaviorSubject({id: 63})
  );

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
