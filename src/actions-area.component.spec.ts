import { EventEmitter, Component, Input, Output } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

// tslint:disable-next-line:max-line-length
import Action from './action';
import ActionEvent from './action-event';
import { ItmButtonMode } from './button.component';
import { ItmActionsAreaComponent } from './actions-area.component';
import { ITM_TARGET } from './item';
import { ItmMaterialModule } from './material.module';
import { ItmButtonsComponent } from './buttons.component';

@Component({selector: 'itm-buttons', template: ''})
export class MockItmButtonsComponent<T> implements Partial<ItmButtonsComponent> {
  @Input()
  target: T;

  @Input()
  mode: ItmButtonMode;

  @Input()
  actions: Action.Config[];

  @Input()
  menuIcon = 'more_vert';

  @Output()
  event = new EventEmitter<ActionEvent>();

}

describe('ItmActionsAreaComponent', () => {
  const target = {id: 63};
  const actions = [
    Action.factory.serialize({key: 'add', icon: 'add_circle_outline'}),
    Action.factory.serialize({key: 'remove', icon: 'remove_circle_outline'})
  ];
  const eventEmitter = new EventEmitter<ActionEvent>();
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
        {provide: Action.SET_TOKEN, useValue: actions},
        {provide: ITM_TARGET, useValue: target},
        {provide: ActionEvent.EMITTER_TOKEN, useValue: eventEmitter},
        {provide: Action.BUTTON_MODE_TOKEN, useValue: buttonsMode}
      ]
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(ItmActionsAreaComponent);
    const debugCell = fixture.debugElement.componentInstance;
    expect(debugCell).toBeTruthy();
  }));
});
