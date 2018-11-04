import { empty } from 'rxjs';

import Button from './button';
import RecordFactory from './record_factory';
import Target from './target';

export function ItmButtonFactory(): RecordFactory<Button, Button.Config>;
export function ItmButtonFactory(...cfgs: Partial<Button.Config>[]): Button;
// tslint:disable-next-line:max-line-length
export function ItmButtonFactory(...cfgs: Partial<Button.Config>[]): Button | RecordFactory<Button, Button.Config> {
  if (!cfgs.length) return ItmButtonFactory._static;
  return ItmButtonFactory._static.serialize(...cfgs);
}

export module ItmButtonFactory {
  export function normalize (cfg: Button.Config): Button.Model {
    if (!cfg.key || !Button.keyRegExp.test(cfg.key)) throw new TypeError('Expected key');
    const key = cfg.key;
    const action = cfg.action && Button.keyRegExp.test(cfg.action) ? cfg.action : key;
    const icon = (
      cfg.icon === false ? () => empty() :
      cfg.icon ? Target.defer('string', cfg.icon || key) :
        null
    );
    const disabled = Target.defer('boolean', cfg.disabled);
    const mode = Target.defer(Button.Mode, cfg.mode);
    const text: Target.Pipe<{}, string> = (
      cfg.text === false ? () => empty() :
      cfg.text ? Target.defer('string', cfg.text) :
        null
    );
    return {key, action, icon, mode, disabled, text};
  }

  const model = {key: null, action: null, icon: null, disabled: null, mode: null, text: null};

  export const _static: RecordFactory<Button, Button.Config> = RecordFactory.build({
    selector: Button.selector,
    normalize,
    model
  });
}

export default ItmButtonFactory;
