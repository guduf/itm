import { EventEmitter, Component, Input, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

// tslint:disable-next-line:max-line-length
import { ItmActionEvent, ItmActionDefs, ITM_TABLE_ACTIONS_BUTTONS_MODE, ItmActionDef, ItmActionConfig } from './action';
import { ItmButtonMode } from './button.component';
import { ItmDefaultActionsCellComponent } from './default-actions-cell.component';
import { Itm } from './item';
import { ItmMaterialModule } from './material.module';
import { ItmButtonsComponent } from './buttons.component';

@Component({selector: 'itm-buttons', template: ''})
export class MockItmButtonsComponent<T> implements Partial<ItmButtonsComponent> {
  @Input()
  target: T;

  @Input()
  mode: ItmButtonMode;

  @Input()
  actions: (ItmActionConfig | ItmActionDef)[];

  @Input()
  menuIcon = 'more_vert';

  @Output()
  event = new EventEmitter<ItmActionEvent>();

}

describe('ItmDefaultActionsCellComponent', () => {
  const item = {id: 63};
  const actions = [
    new ItmActionDef({key: 'add', icon: 'add_circle_outline'}),
    new ItmActionDef({key: 'remove', icon: 'remove_circle_outline'})
  ];
  const eventEmitter = new EventEmitter<ItmActionEvent>();
  const buttonsMode = new BehaviorSubject<ItmButtonMode>('icon');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ItmMaterialModule
      ],
      declarations: [
        MockItmButtonsComponent,
        ItmDefaultActionsCellComponent
      ],
      providers: [
        {provide: ItmActionDefs, useValue: actions},
        {provide: Itm, useValue: item},
        {provide: EventEmitter, useValue: eventEmitter},
        {provide: ITM_TABLE_ACTIONS_BUTTONS_MODE, useValue: buttonsMode}
      ]
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(ItmDefaultActionsCellComponent);
    const debugCell = fixture.debugElement.componentInstance;
    expect(debugCell).toBeTruthy();
  }));
});
