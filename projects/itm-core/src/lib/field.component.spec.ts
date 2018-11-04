import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';

import { ItmFieldComponent } from './field.component';
import { ItmFieldLabel } from './field';
import { ItmAreaText } from './area';

describe('ItmFieldComponent', () => {
  const areaText = of('foo bar');
  const fieldLabel = of('test');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ItmFieldComponent
      ],
      providers: [
        {provide: ItmAreaText, useValue: areaText},
        {provide: ItmFieldLabel, useValue: fieldLabel}
      ]
    });
    TestBed.compileComponents();
  }));

  function setup(): ComponentFixture<ItmFieldComponent> {
    return TestBed.createComponent(ItmFieldComponent);
  }

  it('should initialize', () => {
    expect(setup()).toBeTruthy();
  });
});
