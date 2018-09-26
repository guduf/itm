
import { Itm, ItmPipeLike, deferPipe, ItmPipe } from './item';
import { ItmAreaConfig } from './area-config';
import { ComponentType, isComponentType } from './utils';
import { ItmArea } from './area';
import { of } from 'rxjs';

/** The definition of a column used by ItmTableConfig. */
export interface ItmColumnConfig<I extends Itm = Itm> extends ItmAreaConfig<I> {
  /** Used by MatTable. */
  sortable?: boolean;
  /**
   * The component displayed in the header.
   * In case of component class, the value is used by the component factory.
   * In case of string, the value is used as the attribute for default header cell.
   * In case of false, none header is displayed. */
  header?: ItmPipeLike<I[], string> | ComponentType | false | ItmAreaConfig<I[]>;
}

/** The definition of a column used by ItmTableComponent */
// tslint:disable-next-line:max-line-length
export class ItmColumn<I extends Itm = Itm> extends ItmArea<I> implements ItmColumnConfig {
  /** Whether the column is sortable. */
  readonly sortable: boolean;

  readonly header: ItmArea<I[]>;

  constructor(cfg: ItmColumnConfig<I>) {
    super(cfg, {text: item => of(item[this.key])});
    const headerCfg: ItmAreaConfig = cfg.header !== false && {
      ...(cfg as ItmAreaConfig),
      cell: typeof cfg.header === 'function' ? cfg.header : null,
      ...(typeof cfg.header === 'object' ? cfg.header : {})
    };
    if (headerCfg) (this.header = new ItmArea(headerCfg));
    if (cfg.sortable === true) (this.sortable = true);
  }
}
