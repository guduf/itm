import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';

import ControlFactory from './control_factory';
import ControlRef, { ITM_CONTROL_REF } from './control_ref';
import { ItmControlComponent } from './control.component';
import { ItmFieldLabel } from './field';

describe('ItmControlComponent', () => {
  const fieldLabel = of('test');
  const control = ControlFactory({key: 'id'});
  const controlRef = new ControlRef(control, {id: 63});

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule
      ],
      declarations: [
        ItmControlComponent
      ],
      providers: [
        {provide: ItmFieldLabel, useValue: fieldLabel},
        {provide: ITM_CONTROL_REF, useValue: controlRef}
      ]
    });
    TestBed.compileComponents();
  }));

  function setup(): ComponentFixture<ItmControlComponent> {
    return TestBed.createComponent(ItmControlComponent);
  }

  it('should initialize', () => {
    expect(setup()).toBeTruthy();
  });
});
