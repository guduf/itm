
import { Itm, ItmPipeLike, deferPipe, ItmPipe } from './item';
import { ItmAreaConfig } from './area-config';
import { ItmArea } from './area';
import { of } from 'rxjs';

/** The definition of a column used by ItmTableConfig. */
export interface ItmFieldConfig<I extends Itm = Itm> extends ItmAreaConfig<I> {
  /**
   * The component displayed in the header.
   * In case of string, the value is used as the attribute for default header cell.
   * In case of false, none header is displayed. */
  label?: ItmPipeLike<I, string> | false;
}

/** The definition of a column used by ItmTableComponent */
// tslint:disable-next-line:max-line-length
export class ItmField<I extends Itm = Itm> extends ItmArea<I> implements ItmFieldConfig {
  readonly defaultLabel?: ItmPipe<I, string>;

  constructor(cfg: ItmFieldConfig<I>) {
    super(cfg, {text: item => of(item[this.key])});
    if (this.defaultText) (this.defaultLabel = (
      cfg.label !== false ? null :
      typeof cfg.label === 'function' ? deferPipe(cfg.label) :
        () => of(this.key)
    ));
  }
}
