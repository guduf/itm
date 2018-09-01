import { TestBed, async } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';

import { ITM_DEFAULT_CELL_VALUE_CHANGES } from './column-def';
import { ItmDefaultCellComponent } from './default-cell.component';

describe('ItmDefaultCellComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ItmDefaultCellComponent
      ],
      providers: [
        {provide: ITM_DEFAULT_CELL_VALUE_CHANGES, useValue: of(null) }
      ]
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(ItmDefaultCellComponent);
    const debugCell = fixture.debugElement.componentInstance;
    expect(debugCell).toBeTruthy();
  }));

  it('should display expected values', async(() => {
    const expectedValue = 'Scott';
    const valueChanges = new BehaviorSubject(expectedValue);
    TestBed.overrideProvider(ITM_DEFAULT_CELL_VALUE_CHANGES, {useValue: valueChanges});
    const fixture = TestBed.createComponent(ItmDefaultCellComponent);
    const el: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    expect(el.innerText).toBe(expectedValue, 'Expected the first value displayed');
    valueChanges.next(expectedValue.toUpperCase());
    fixture.detectChanges();
    expect(el.innerText).toBe(expectedValue.toUpperCase(), 'Expected the second value displayed');
  }));
});
