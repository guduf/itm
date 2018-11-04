import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  HostBinding,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';

import Grid from './grid';
import Form from './form';
import FormFactory from './form_factory';
import { ItmGridComponent } from './grid.component';
import FormRef from './form_ref';

const SELECTOR = 'itm-form';

@Component({
  selector: SELECTOR,
  template: `
    <itm-grid [grid]="formRecord" [target]="target" (action)="handleAction($event)"></itm-grid>
  `
})
// tslint:disable-next-line:max-line-length
export class ItmFormComponent<T extends Object = {}> implements AfterViewInit, OnChanges {
  @Input()
  /** The configuration of the table. */
  form: Grid.Config = null;

  @Input()
  /** The target of the grid. */
  target: T | Observable<T>;

  @HostBinding('class')
  get hostClass(): string { return SELECTOR; }

  @ViewChild(ItmGridComponent)
  gridComp: ItmGridComponent;

  get formRecord(): Form { return this._form; }

  private _form: Form;

  handleAction(e: any) {
    console.log(e);
  }

  ngOnChanges({form: formChanges}: SimpleChanges) {
    if (formChanges) (this._form = FormFactory(this.form));
  }

  ngAfterViewInit() {
    const formRef: FormRef = this.gridComp.ref.injector.get(FormRef);
    console.log(formRef, Object.keys(formRef.controls).map(key => formRef.get(key).errors));
  }
}
