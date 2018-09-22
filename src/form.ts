import { ItmGridConfig, ItmGridDef } from './grid';
import { ItmControlConfig, ItmControlDef } from './control';
import { ItmAreasConfig, ItmAreaConfig } from './area-config';

export interface ItmFormConfig<T = {}> extends ItmGridConfig<ItmControlConfig<T>, T> {
  controls?: ItmAreasConfig<ItmControlDef<T>>;
}

// tslint:disable-next-line:max-line-length
export class ItmFormDef<T = {}> extends ItmGridDef<ItmControlDef<T>, T> implements ItmFormConfig<T> {
  constructor(cfg: ItmGridConfig<T> = {}) {
    super(cfg, [/column.()/]);
  }

  controls: Map<string, ItmControlDef>;
}
