import { Record, RecordOf, mergeDeep } from 'immutable';

// tslint:disable-next-line:max-line-length
import { ItmArea, AREA_ROOT_SELECTOR, AREA_SELECTOR_REGEXP, AREA_SELECTOR_SUFFIX_REGEXP } from './area';
import { ItmAreaConfig } from './area-config';

const AREA_DEFAULT: ItmArea = {
  key: null,
  size: null,
  grow: null,
  cell: null,
  text: null,
  providers: null
};

export class ItmAreaFactory<
  K extends new (cfg: C) => A,
  A extends ItmArea = ItmArea,
  C extends ItmAreaConfig = ItmAreaConfig
> {
  static readonly default = new ItmAreaFactory(AREA_ROOT_SELECTOR, ItmArea, AREA_DEFAULT);

  selector: string;

  private readonly _factory: Record.Factory<A>;
  private readonly _selectorRegExp: RegExp;

  static isAreaRecord(maybeArea: any): boolean {
    return (
      Record.isRecord(maybeArea) &&
      AREA_SELECTOR_REGEXP.test(Record.getDescriptiveName(maybeArea))
    );
  }

  constructor(
    selector: string,
    private readonly _areaCtor: K,
    defaultArea: A
  ) {
    if (!AREA_SELECTOR_SUFFIX_REGEXP.test(selector))
      throw new TypeError('Expected area selector pattern');
    this.selector = (
      selector === AREA_ROOT_SELECTOR ? selector : (`${AREA_ROOT_SELECTOR}:${selector}`)
    );
    this._selectorRegExp = new RegExp(`^${AREA_ROOT_SELECTOR}$`);
    this._factory = Record(defaultArea, this.selector);
  }

  create(...cfgs: (C | RecordOf<A>)[]): RecordOf<A> {
    if (!cfgs.length) return null;
    const orginal = this.serialize(cfgs[0]);
    if (cfgs.length === 1) return orginal;
    return mergeDeep(orginal, cfgs.slice(1).map(cfg => this.serialize(cfg)));
  }

  serialize(cfg: C | RecordOf<A>): RecordOf<A> {
    if (this.isFactoryRecord(cfg)) return cfg as RecordOf<A>;
    const instance = new this._areaCtor(cfg as C);
    return this._factory(instance);
  }

  isFactoryRecord(maybeRecord: any): boolean {
    return (
      Record.isRecord(maybeRecord) &&
      this._selectorRegExp.test(Record.getDescriptiveName(maybeRecord))
    );
  }

  deserialize(record: RecordOf<A>): A {
    if (!ItmAreaFactory.isAreaRecord(record)) throw new TypeError('Expected record of ItmArea');
    return new this._areaCtor(record.toObject() as any);
  }
}
