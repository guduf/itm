import { Component, Input, OnChanges, SimpleChanges, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';

import Grid from './grid';
import Form from './form';

const SELECTOR = 'itm-form';

@Component({
  selector: SELECTOR,
  template: `<itm-grid [grid]="formRecord" [source]="source"></itm-grid>`
})
// tslint:disable-next-line:max-line-length
export class ItmFormComponent<T extends Object = {}> implements OnChanges {
  @Input()
  /** The configuration of the table. */
  form: Grid.Config = null;

  @Input()
  /** The target of the grid. */
  source: T | Observable<T>;

  @HostBinding('class')
  get hostClass(): string { return SELECTOR; }

  get formRecord(): Form { return this._form; }

  private _form: Form;

  ngOnChanges({form: formChanges}: SimpleChanges) {
    if (formChanges) (this._form = Form.factory.serialize(this.form));
  }
}
