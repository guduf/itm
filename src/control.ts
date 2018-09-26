import { ItmAreaConfig } from './area-config';
import { ItmArea } from './area';

export interface ItmControlConfig<T = {}> extends ItmAreaConfig<T> {
  pattern?: RegExp;
  required?: boolean;
}

// tslint:disable-next-line:max-line-length
export class ItmControlDef<T = {}> extends ItmArea<T> implements ItmControlConfig<T> {
  readonly pattern: RegExp;
  readonly required: boolean;

  constructor(cfg: ItmControlConfig<T>) {
    super(cfg);
    this.pattern = cfg.pattern instanceof RegExp ? cfg.pattern : null;
    this.required = typeof cfg.required === 'boolean' ? cfg.required : false;
  }
}
