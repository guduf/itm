import { TestBed, async } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';

import { ItmHeaderAreaComponent } from './header-area.component';
import { ItmsChanges } from './item';
import { ItmPropAreaDef } from './area-def';

describe('ItmHeaderAreaComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ItmHeaderAreaComponent
      ],
      providers: [
        {provide: ItmPropAreaDef, useValue: new ItmPropAreaDef({key: 'id'}) },
        {provide: ItmsChanges, useValue: of([{id: 63}]) }
      ]
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(ItmHeaderAreaComponent);
    const debugCell = fixture.debugElement.componentInstance;
    expect(debugCell).toBeTruthy();
  }));

  it('should display expected values', async(() => {
    const expectedHeader = 'Scott';
    const valueChanges = new BehaviorSubject(expectedHeader);
    TestBed.overrideProvider(ItmPropAreaDef, {
      useValue: new ItmPropAreaDef({key: 'id', header: () => valueChanges})
    });
    const fixture = TestBed.createComponent(ItmHeaderAreaComponent);
    const el: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    expect(el.innerText).toBe(expectedHeader, 'Expected the first value displayed');
    valueChanges.next(expectedHeader.toUpperCase());
    fixture.detectChanges();
    expect(el.innerText).toBe(expectedHeader.toUpperCase(), 'Expected the second value displayed');
  }));
});
