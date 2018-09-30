
import { ItmPipeLike } from './item';
import { ComponentType, isComponentType } from './utils';
import { Map, RecordOf } from 'immutable';
import RecordFactory from './record-factory';
import { ItmAreaConfig } from './area-config';

/** The definition of a column used by ItmTableComponent */
class ItmAreaModel<T = {}> implements ItmArea.Config<T> {
  /** see [[ItmAreaConfig.key]]. */
  readonly key: string;
  /** see [[ItmAreaConfig.size]]. */
  readonly size: number;
  /** see [[ItmAreaConfig.grow]]. */
  readonly grow: number;
  /** see [[ItmAreaConfig.cell]]. */
  readonly cell?: ComponentType;

  readonly text?: ItmPipeLike<T, string>;

  readonly providers: Map<any, any>;

  constructor(cfg: ItmAreaConfig<T>) {
    if (cfg.key && typeof cfg.key === 'string') this.key = cfg.key;
    // tslint:disable-next-line:max-line-length
    else throw new TypeError('InvalidItmAreaConfig : Expected [key] as string for ItmAreaConfig');
    this.size = cfg.size && typeof cfg.size === 'number' ? cfg.size : 1;
    this.grow = cfg.grow && typeof cfg.grow === 'number' ? cfg.grow : 1;
    this.cell = cfg.cell !== false && isComponentType(cfg.cell) ? cfg.cell as ComponentType : null;
    this.text = (
      cfg.text === false ? null :
      typeof cfg.text  === 'function' ? cfg.text :
      !this.cell && (typeof cfg.cell === 'string' || typeof cfg.cell === 'function') ?
        cfg.cell as ItmPipeLike<T, string> :
        this.key
    );
    this.providers = (
      Map.isMap(cfg.providers) ? cfg.providers :
      !Array.isArray(cfg.providers) ? Map() :
        cfg.providers
          .map(({provide, useValue}) => {
            if (!provide || !useValue) throw new TypeError('Expected value provider');
            return [provide, useValue];
          })
          .reduce((acc, [key, val]) => acc.set(key, val), Map<any, any>())
    );
  }
}

export module ItmArea {
  const selector = 'area';

  export type Config<T = {}> = ItmAreaConfig<T>;

  export type Model<T = {}> = ItmAreaModel<T>;

  export type Record<T = {}> = RecordOf<Model<T>>;

  export const factory: RecordFactory<ItmArea.Record, ItmArea.Config> = RecordFactory.build({
    selector,
    serializer: (cfg: ItmArea.Config) => new ItmAreaModel(cfg),
    model: {key: null, size: null, grow: null, cell: null, text: null, providers: Map()}
  });
}

export default ItmArea;
