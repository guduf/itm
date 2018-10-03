import { DebugElement, OnChanges, SimpleChanges, SimpleChange, OnInit } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
export const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 }
};

/** Simulate element click. Defaults to mouse left-button click event. */
export function click(
  el: DebugElement | HTMLElement,
  eventObj: any = ButtonClickEvents.left
): void {
  if (el instanceof HTMLElement) el.click();
  else el.triggerEventHandler('click', eventObj);
}

export function changeInputs<T = { }>(
  debugElement: DebugElement | ComponentFixture<T>,
  changes: { [K in keyof T]?: T[K] },
  isFirstChange: boolean | (keyof T)[] = false,
  fixture?: ComponentFixture<any>
): void {
  fixture = (
    debugElement instanceof ComponentFixture ?
    debugElement as ComponentFixture<T> :
    fixture
  );
  const previous = {...debugElement.componentInstance};
  Object.assign(debugElement.componentInstance, changes);
  const current = debugElement.componentInstance;
  if (typeof (current as OnChanges).ngOnChanges === 'function') {
    const simpleChanges: SimpleChanges = {};
    for (const key in changes) if (previous[key] !== current[key]) (
      simpleChanges[key] = new SimpleChange(previous[key], current[key], (
        Array.isArray(isFirstChange) ? isFirstChange.includes(key) : Boolean(isFirstChange)
      ))
    );
    (current as OnChanges).ngOnChanges(simpleChanges);
  }
  if (typeof (current as OnInit).ngOnInit === 'function') current.ngOnInit();
  if (fixture) fixture.detectChanges();
}
