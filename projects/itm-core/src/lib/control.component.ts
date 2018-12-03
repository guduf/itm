import { Component, HostBinding, Inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import ControlRef, { ITM_CONTROL_REF } from './control_ref';
import { ItmFieldLabel } from './field';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const SELECTOR = 'itm-control';

/** Default component for control area if not specified in config. */
@Component({
  selector: SELECTOR,
  template: `
    <mat-form-field>
      <input *ngIf="inputType"
        matInput [type]="inputType" [required]="required" [placeholder]="label | async"
        [formControl]="ngControl" />
      <mat-error *ngFor="let error of errors | async">{{error}}</mat-error>
    </mat-form-field>
  `
})
export class ItmControlComponent {
  @HostBinding('class')
  /** The CSS class of the host element. */
  get hostClass(): string { return SELECTOR; }

  get ngControl(): AbstractControl { return this._controlRef; }

  get required(): boolean { return this._controlRef.record.required; }

  readonly errors: Observable<string[]>;

  readonly inputType: string | number;

  constructor(
    readonly label: ItmFieldLabel,
    @Inject(ITM_CONTROL_REF)
    private readonly _controlRef: ControlRef
  ) {
    const {type} = this._controlRef.record.schema;
    this.inputType = (
      ['string', 'integer', 'number'].includes(type) ?
        type === 'string' ? 'string' : 'number' :
        null
    );
    this.errors = this._controlRef.valueChanges.pipe(
      map(() => {
        const {valid, errors} = this._controlRef;
        if (valid) return [] as string[];
        if (errors.schema) return (errors.schema).map(err => err.message);
      }),
    );
  }
}
