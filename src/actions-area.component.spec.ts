import { EventEmitter, Component, Input, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

// tslint:disable-next-line:max-line-length
import { ItmActionEvent, ItmActions, ITM_TABLE_ACTIONS_BUTTONS_MODE, ItmAction, ItmActionConfig, ItmActionEmitter } from './action';
import { ItmButtonMode } from './button.component';
import { ItmActionsAreaComponent } from './actions-area.component';
import { Itm, ItmTarget } from './item';
import { ItmMaterialModule } from './material.module';
import { ItmButtonsComponent } from './buttons.component';

@Component({selector: 'itm-buttons', template: ''})
export class MockItmButtonsComponent<T> implements Partial<ItmButtonsComponent> {
  @Input()
  target: T;

  @Input()
  mode: ItmButtonMode;

  @Input()
  actions: (ItmActionConfig | ItmAction)[];

  @Input()
  menuIcon = 'more_vert';

  @Output()
  event = new EventEmitter<ItmActionEvent>();

}

describe('ItmActionsAreaComponent', () => {
  const target = {id: 63};
  const actions = [
    new ItmAction({key: 'add', icon: 'add_circle_outline'}),
    new ItmAction({key: 'remove', icon: 'remove_circle_outline'})
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
        ItmActionsAreaComponent
      ],
      providers: [
        {provide: ItmActions, useValue: actions},
        {provide: ItmTarget, useValue: target},
        {provide: ItmActionEmitter, useValue: ItmActionEmitter},
        {provide: ITM_TABLE_ACTIONS_BUTTONS_MODE, useValue: buttonsMode}
      ]
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(ItmActionsAreaComponent);
    const debugCell = fixture.debugElement.componentInstance;
    expect(debugCell).toBeTruthy();
  }));
});
