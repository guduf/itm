
import { Map } from 'immutable';
import { of, empty } from 'rxjs';

import Area from './area';
import Field, { ItmFieldLabel } from './field';
import AreaFactory from './area_factory';
import Target from './target';

export function ItmFieldFactory(): AreaFactory<Field, Field.Config>;
export function ItmFieldFactory(...cfgs: Partial<Field.Config>[]): Field;
// tslint:disable-next-line:max-line-length
export function ItmFieldFactory(...cfgs: Partial<Field.Config>[]): Field | AreaFactory<Field, Field.Config> {
  if (!cfgs.length) return ItmFieldFactory._static;
  return ItmFieldFactory._static.serialize(...cfgs);
}

export module ItmFieldFactory {
  const fieldLabelProvider: Area.Provider = {
    deps: [Area, Target],
    useFactory: provideFieldLabel
  };

  export function provideFieldLabel(area: Field, target: Target): ItmFieldLabel {
    return Target.map(target, area.label || (() => of(area.key)));
  }

  const shared = new AreaFactory.Shared({
    defaultComp: opts => opts.defaultFieldComp,
    defaultText: ({area, target}) => of(target ? target[area.key] : null),
    providers: Map<any, Area.Provider>()
      .set(ItmFieldLabel, fieldLabelProvider)
  });


  export function normalize(cfg: Field.ModelConfig): Field.Model {
    const label = (
      cfg.label === false ? () => empty() : Target.defer('string', cfg.label)
    );
    return {label};
  }

  export const _static: AreaFactory<Field, Field.Config> = AreaFactory().extend({
    selector: Field.selector,
    normalize,
    model: {label: null},
    shared
  });
}

export default ItmFieldFactory;
