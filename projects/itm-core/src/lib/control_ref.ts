import { InjectionToken } from '@angular/core';
import { FormControl, ValidationErrors, AbstractControl } from '@angular/forms';
import * as Ajv from 'ajv';
import { Observable, of } from 'rxjs';

import Control from './control';
import FormRef from './form_ref';
import Target from './target';

export const ITM_CONTROL_REF = new InjectionToken('ITM_CONTROL_REF');

// tslint:disable-next-line:max-line-length
export class ItmControlRef<T extends Object = {}> extends FormControl {
  errors: ItmControlRef.Validation;

  readonly record: Control;

  constructor(record: Control, target: T) {
    const init = target && target[record.key];
    const {required, schema} = record;
    const schemaValidator = new Ajv().compile(schema);
    super(init || null, null, (c: AbstractControl) => (
      ItmControlRef.validateSchema(c, required, schemaValidator)
    ));
    this.record = record;
  }
}

export module ItmControlRef {
  export interface Validation extends ValidationErrors {
    required?: boolean;
    schema?: Ajv.ErrorObject[];
    [key: string]: boolean | Ajv.ErrorObject[];
  }

  // tslint:disable-next-line:max-line-length
  export function validateSchema(c: AbstractControl, required: boolean, schemaValidator: Ajv.ValidateFunction): Observable<ItmControlRef.Validation> {
    const value = c.value;
    if (typeof value === 'undefined' || value === null)
      return of(required ? {required: true} : null);
    const valid = schemaValidator(value);
    console.log(typeof value, value, valid, schemaValidator.errors);
    if (valid) return of(null);
    return of({schema: schemaValidator.errors});
  }

  export function provide(control: Control, target: Target, formRef?: FormRef): ItmControlRef {
    return (
      formRef ? formRef.get(control.key) : new ItmControlRef(control, target.value)
    );
  }
}

export default ItmControlRef;
