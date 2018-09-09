import { FormGroup, FormControl } from '@angular/forms';
import { User } from 'example/app/app.component';

export class ItmFormGroup<I> extends FormGroup {
  /** see [[FormGroup.controls]] */
  controls: { [P in keyof I]?: FormControl; } & { [key: string]: FormControl };

  constructor(type: any) {
    super({});
  }
}

const a: ItmFormGroup<User> = null;
