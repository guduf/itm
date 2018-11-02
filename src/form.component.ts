import { Component, Input, OnChanges, SimpleChanges, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';

import Grid from './grid';
import Form from './form';

const SELECTOR = 'itm-form';

@Component({
  selector: SELECTOR,
  template: `
    <itm-grid [grid]="formRecord" [target]="target" (action)="handleAction($event)"></itm-grid>
  `
})
// tslint:disable-next-line:max-line-length
export class ItmFormComponent<T extends Object = {}> implements OnChanges {
  @Input()
  /** The configuration of the table. */
  form: Grid.Config = null;

  @Input()
  /** The target of the grid. */
  target: T | Observable<T>;

  @HostBinding('class')
  get hostClass(): string { return SELECTOR; }

  get formRecord(): Form { return this._form; }

  private _form: Form;

  handleAction(e: any) {
    console.log(e);
  }

  ngOnChanges({form: formChanges}: SimpleChanges) {
    if (formChanges) (this._form = Form.factory.serialize(this.form));
  }
}
