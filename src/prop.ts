import { ItmAreaConfig } from './area-config';
import { ItmColumnConfig, ItmColumnDef } from './column';
import { Itm, ItmPipeLike, ItmPipe, deferPipe } from './item';
import { ItmGridDef } from './grid';

export interface ItmPropConfig<I extends Itm = Itm> extends Partial<ItmAreaConfig<I>> {
  key?: string;
  computed?: boolean;
  label?: ItmPipeLike<I, string>;
  size?: number;
  text?: ItmPipeLike<I, string>;
  column?: ItmColumnConfig<I>;
}

export class ItmPropDef<I extends Itm = Itm> implements ItmPropConfig<I> {
  readonly key: string;
  readonly computed: boolean;
  readonly label: ItmPipe<I, string>;
  readonly size: number;
  readonly text: ItmPipe<I, string>;
  readonly card: ItmGridDef<I>;
  readonly column: ItmColumnDef<I>;

  constructor(key: symbol | string, cfg: ItmPropConfig<I>) {
    if (cfg.key && typeof cfg.key === 'string') (this.key = cfg.key);
    else if (key && typeof key === 'string') (this.key = key);
    // tslint:disable-next-line:max-line-length
    else throw new TypeError('InvalidItmPropConfig: Key must be specified in config if prop key is not a string');
    this.computed = cfg.computed || false;
    this.size = cfg.size >= 0 ? Math.round(cfg.size) : 2;
    this.label = deferPipe(cfg.label || this.key);
    this.text = deferPipe(cfg.label || ((item: I) => item[this.key]));
    this.column = new ItmColumnDef({
      key: this.key,
      ...(cfg.column && typeof cfg.column === 'object' ? cfg.column : {}),
      ...(cfg as ItmColumnConfig<I>)
    });
  }

  createColumnDef(): ItmColumnDef {
    return new ItmColumnDef({
      key: String(this.key),
      size: this.size
    });
  }
}

export const ITM_PROPS_META = Symbol('ITM_PROPS_META');

// tslint:disable-next-line:max-line-length
export function ItmProp<I extends Itm = Itm>(cfg: ItmPropConfig<I> = {}): PropertyDecorator {
  return (proto: any, key: (string | symbol) & keyof I) => {
    let props: Map<keyof I, ItmPropDef> = Reflect.get(proto, ITM_PROPS_META);
    if (!props) {
      props = new Map();
      Reflect.set(proto, ITM_PROPS_META, props);
    }
    let propDef: ItmPropDef;
    try { propDef = new ItmPropDef<I>(key, cfg); }
    catch (err) {
      console.error(err);
      throw new TypeError(`Failed to create ItmPropDef for key '${String(key)}': ${proto}`);
    }
    props.set(key, propDef);
  };
}
