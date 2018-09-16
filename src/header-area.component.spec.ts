import { TestBed, async } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';

import { ItmHeaderAreaComponent } from './header-area.component';
import { ItmColumnDef } from './column';
import { ItmsChanges } from './item';

describe('ItmHeaderAreaComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ItmHeaderAreaComponent
      ],
      providers: [
        {provide: ItmColumnDef, useValue: new ItmColumnDef({key: 'id'}) },
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
    TestBed.overrideProvider(ItmColumnDef, {
      useValue: new ItmColumnDef({key: 'id', header: () => valueChanges})
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
