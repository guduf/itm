import { RecordOf, Record, mergeDeep } from 'immutable';

export const ITM_SELECTOR_PATTERN = '[a-z]\\w+';
export const ITM_SELECTOR_PATTERN_SEP = ':';
// tslint:disable-next-line:max-line-length
export const ITM_SELECTOR_REGEX = new RegExp(`^${ITM_SELECTOR_PATTERN}(:${ITM_SELECTOR_PATTERN})*$`);

export abstract class ItmRecordFactory<
  K extends new (cfg: C) => R,
  R extends Object,
  C extends Object
> {
  private readonly _factory: Record.Factory<R>;
  private readonly _selectorRegExp: RegExp;

  constructor(
    readonly selector: string,
    private readonly serializer: K,
    defaultValue: R,
    rootSelector: string
  ) {
    if (!ITM_SELECTOR_REGEX.test(selector)) throw new TypeError('Expected selector pattern');
    this.selector = (
      selector === rootSelector ? selector : (`${rootSelector}:${selector}`)
    );
    this._factory = Record(defaultValue, this.selector);
  }

  create(...cfgs: (C | RecordOf<R>)[]): RecordOf<R> {
    if (!cfgs.length) return null;
    const orginal = this.serialize(cfgs[0]);
    if (cfgs.length === 1) return orginal;
    return mergeDeep(orginal, cfgs.slice(1).map(cfg => this.serialize(cfg)));
  }

  serialize(cfg: C | RecordOf<R>): RecordOf<R> {
    if (this.isFactoryRecord(cfg)) return cfg as RecordOf<R>;
    const instance = new this.serializer(cfg as C);
    return this._factory(instance);
  }

  isFactoryRecord(maybeRecord: any): boolean {
    return (
      Record.isRecord(maybeRecord) &&
      this._selectorRegExp.test(Record.getDescriptiveName(maybeRecord))
    );
  }
}
