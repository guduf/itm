import { TestBed, async } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';

import { ItmTextAreaComponent } from './text-area.component';
import { ItmAreaDef } from './area-def';

describe('ItmTextAreaComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ItmTextAreaComponent
      ],
      providers: [
        {provide: ItmAreaDef, useValue: new ItmAreaDef({key: 'name'})},
        {provide: ITM_TARGET, useValue: {id: 63, name: 'Scott'}}
      ]
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(ItmTextAreaComponent);
    const debugCell = fixture.debugElement.componentInstance;
    expect(debugCell).toBeTruthy();
  }));

  it('should display expected values', async(() => {
    const expectedText = 'Scott';
    const textChanges = new BehaviorSubject(expectedText);
    TestBed.overrideProvider(ItmAreaDef, {
      useValue: new ItmAreaDef({key: 'id', cell: () => textChanges})
    });
    const fixture = TestBed.createComponent(ItmTextAreaComponent);
    const el: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    expect(el.innerText).toBe(expectedText, 'Expected the first text displayed');
    textChanges.next(expectedText.toUpperCase());
    fixture.detectChanges();
    expect(el.innerText).toBe(expectedText.toUpperCase(), 'Expected the second value displayed');
  }));
});
