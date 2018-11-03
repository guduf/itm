import { FormControl, ValidationErrors, AbstractControl } from '@angular/forms';
import { isCollection } from 'immutable';
import { Observable, of } from 'rxjs';

import Control from './control';
import FormRef from './form_ref';
import Target from './target';

// tslint:disable-next-line:max-line-length
export class ItmControlRef<T extends Object = {}> extends FormControl {
  readonly record: Control;

  parent: FormRef<T>;

  constructor(record: Control, init: T) {
    super(init[record.key], null, (c: this) => ItmControlRef.validateSchema(c, record));
    this.record = record;
  }
}

export module ItmControlRef {
  export interface Validation extends ValidationErrors {
    [key: string]: boolean | string;
  }

  export function provide(control: Control, target: Target, formRef?: FormRef): ItmControlRef {
    return (
      formRef ? formRef.get(control.key) : new ItmControlRef(control, target.value[control.key])
    );
  }

  export function validateSchema(
    control: AbstractControl,
    record: Control
  ): Observable<Validation> {
    const {value} = control;
    if (typeof value === 'undefined' || value === null)
      return of(record.required ? {required: true} : null);
    const {pattern, min, max} = record;
    if (
      pattern instanceof RegExp && !pattern.test(value) ||
      isCollection(pattern) && !pattern.has(value) ||
      (min !== null && max !== null) && !(value >= min && value <= max) ||
      (min !== null) && !(value >= min) ||
      (max !== null) && !(value <= max)
    ) return of({schema: true});
    return record.validator ? record.validator(control) : of(null);
  }
}

export default ItmControlRef;
