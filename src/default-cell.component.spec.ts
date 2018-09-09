import { TestBed, async } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';

import { ItmDefaultCellComponent } from './default-cell.component';
import { ItmColumnDef } from './column';
import { Itm } from './item';

describe('ItmDefaultCellComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ItmDefaultCellComponent
      ],
      providers: [
        {provide: ItmColumnDef, useValue: new ItmColumnDef({key: 'name'})},
        {provide: Itm, useValue: {id: 63, name: 'Scott'}}
      ]
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(ItmDefaultCellComponent);
    const debugCell = fixture.debugElement.componentInstance;
    expect(debugCell).toBeTruthy();
  }));

  it('should display expected values', async(() => {
    const expectedText = 'Scott';
    const textChanges = new BehaviorSubject(expectedText);
    TestBed.overrideProvider(ItmColumnDef, {
      useValue: new ItmColumnDef({key: 'id', text: () => textChanges})
    });
    const fixture = TestBed.createComponent(ItmDefaultCellComponent);
    const el: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    expect(el.innerText).toBe(expectedText, 'Expected the first text displayed');
    textChanges.next(expectedText.toUpperCase());
    fixture.detectChanges();
    expect(el.innerText).toBe(expectedText.toUpperCase(), 'Expected the second value displayed');
  }));
});
