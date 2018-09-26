// tslint:disable:max-line-length
import { Component, DebugElement } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MatIconModule, MatButtonModule } from '@angular/material';

import { ItmButtonComponent, ItmButtonMode } from './button.component';
import { ItmConfig } from './config';
import { DEFAULT_CONFIG } from './itm.module';
import { ItmActionConfig, ItmAction } from './action';
import { By } from '@angular/platform-browser';
import { changeInputs } from './helpers.spec';

@Component({
  template: `
    <itm-button
      [target]="target"
      [mode]="mode"
      (event)="onEvent($event)"
      [action]="action"></itm-button>
  `
})
export class ItmButtonHotTestComponent {
  target?: any;
  mode?: ItmButtonMode;
  event?: any;
  action?: string | ItmActionConfig;
}

describe('ItmButtonComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatButtonModule
      ],
      declarations: [
        ItmButtonHotTestComponent,
        ItmButtonComponent
      ],
      providers: [
        {provide: ItmConfig, useValue: DEFAULT_CONFIG}
      ]
    }).compileComponents();
  }));

  it('should create the button', async(() => {
    const fixture = TestBed.createComponent(ItmButtonComponent);
    const debugButton = fixture.debugElement.componentInstance;
    expect(debugButton).toBeTruthy();
  }));

  it('should have no children element when no action', async(() => {
    const fixture = TestBed.createComponent(ItmButtonComponent);
    fixture.detectChanges();
    const buttonElem = fixture.debugElement.nativeElement as HTMLElement;
    expect(buttonElem.children.length).toBe(0);
  }));

  function setup(config: ItmButtonHotTestComponent = {action: 'create'}): {
    fixture: ComponentFixture<ItmButtonHotTestComponent>,
    itmButton: DebugElement,
    getButton: () => DebugElement,
    instance: ItmButtonComponent
  } {
    const fixture = TestBed.createComponent(ItmButtonHotTestComponent);
    changeInputs(fixture, config);
    const itmButton = fixture.debugElement.query(By.directive(ItmButtonComponent));
    const instance = itmButton.componentInstance;
    return {fixture, instance, itmButton, getButton: () => itmButton.query(By.css('button')) };
  }

  it('should create the action definition observing the action input', async(() => {
    let action: string | ItmActionConfig | ItmAction = 'create';
    const {fixture, instance} = setup({action});
    expect(instance.actionDef).toBeDefined();
    expect(instance.actionDef.key).toBe(action, 'Expected action definition with expected key when action is as string');
    action = {key: 'edit'};
    changeInputs(fixture, {action});
    expect(instance.actionDef).toBeDefined();
    expect(instance.actionDef.key).toBe(action.key, 'Expected action definition with expected key when action is as string');
    action = new ItmAction({key: 'delete'});
    changeInputs(fixture, {action});
    expect(instance.actionDef).toBeDefined();
    expect(instance.actionDef.key).toBe(action.key, 'Expected action definition with expected key when action is as string');
  }));

  it('should display the button observing the mode input', async(() => {
    const {fixture, getButton} = setup();
    expect(getButton().attributes['mat-button']).toBeDefined();
    changeInputs(fixture, {mode: 'icon'});
    expect(getButton().attributes['mat-icon-button']).toBeDefined();
    changeInputs(fixture, {mode: 'menu'});
    expect(getButton().attributes['mat-menu-item']).toBeDefined();
  }));

  it('should display the text and the icon observing the column definition', async(() => {
    const action: string | ItmActionConfig = {key: 'print'};
    const {fixture, getButton} = setup({action});
    expect(getButton().attributes['mat-button']).toBeDefined();
  }));
});
