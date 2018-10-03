import { TestBed, async } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { ItmTextAreaComponent } from './text-area.component';
import Area from './area';
import { ITM_TARGET } from './item';

describe('ItmTextAreaComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ItmTextAreaComponent
      ],
      providers: [
        {provide: Area.RECORD_TOKEN, useValue: Area.factory.serialize({key: 'name'})},
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
    TestBed.overrideProvider(Area.RECORD_TOKEN, {
      useValue: Area.factory.serialize({key: 'id', cell: () => textChanges})
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
