import { InjectionToken } from '@angular/core';
import { FormControl, ValidationErrors, AbstractControl } from '@angular/forms';
import { isCollection } from 'immutable';
import { Observable, of } from 'rxjs';

import Control from './control';
import Target from './target';

export const ITM_CONTROL_REF = new InjectionToken('ITM_CONTROL_REF');

// tslint:disable-next-line:max-line-length
export class ItmControlRef<T extends Object = {}> extends FormControl {
  readonly record: Control;

  constructor(record: Control, init: T) {
    super(init[record.key], null, (c: this) => ItmControlRef.validateSchema(c, record));
    this.record = record;
  }
}

export module ItmControlRef {
  export interface Validation extends ValidationErrors {
    [key: string]: boolean | string;
  }

  export function provide(control: Control, target: Target): ItmControlRef {
    return (
      new ItmControlRef(control, target.value[control.key])
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
