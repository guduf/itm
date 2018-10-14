import { RecordOf, Record, OrderedMap, Collection, Set } from 'immutable';

// tslint:disable-next-line:max-line-length
export class ItmRecordFactory<R extends RecordOf<M> = RecordOf<M>, C = {}, M extends C = C, S extends Object = {}> {
  private readonly _cfgFactory: Record.Factory<C>;

  static build<M extends C, C extends Object, S extends Object>(
    cfg: {
      selector: string,
      shared?: S,
      serializer?: ItmRecordFactory.Serializer<C, M, null, S>,
      model?: { [P in keyof M]: null },
      ancestors?: never
    }
  ): ItmRecordFactory<RecordOf<M>, C, M, S>;

  // tslint:disable-next-line:max-line-length
  static build<M extends C, C extends Object, AR extends RecordOf<AC>, AC extends Object = {}, S extends Object = {}>(
    cfg: {
      selector: string,
      shared?: S,
      serializer?: ItmRecordFactory.Serializer<C, M, AR, S>,
      model?: { [P in keyof M]: null },
      ancestors: [ItmRecordFactory<AR, AC>]
    }
  ): ItmRecordFactory<AR & RecordOf<M>, AC & C, any, S>;

  // tslint:disable-next-line:max-line-length
  static build<R1 extends RecordOf<M1>, C1 extends Object, M1 extends C1, R2 extends RecordOf<M2>, C2 extends Object, M2 extends C2, S extends Object = {}>(
    cfg: {
      selector: string,
      shared?: S,
      serializer?: never,
      model?: never,
      ancestors: [ItmRecordFactory<R1, C1>, ItmRecordFactory<R2, C2>]
    }
  ): ItmRecordFactory<R1 & R2, C1 & C2, any, S>;

  static build<M extends C, C extends Object>(
    cfg: {
      selector: string;
      shared?: any;
      serializer?: ItmRecordFactory.Serializer<C, M, RecordOf<any>, any>;
      model?: { [P in keyof M]: null };
      ancestors?: ItmRecordFactory[];
    }
  ): ItmRecordFactory<RecordOf<M>, C, any, any> {
    // tslint:disable-next-line:max-line-length
    if (!ItmRecordFactory.selectorRegex.test(cfg.selector)) throw new TypeError('Expected selector pattern');
    const selector = cfg.selector;
    // tslint:disable-next-line:max-line-length
    if (cfg.serializer && !cfg.model) throw new TypeError('Expected model when serializer is specified');
    const ancestors = Collection(cfg.ancestors).reduce(
      (acc, ancestor) => {
        // tslint:disable-next-line:max-line-length
        if (!(ancestor instanceof ItmRecordFactory)) throw new TypeError('Expected ItmRecordFactory');
        ancestor.ancestors.forEach((superAncestor, superSelector) => {
          if (acc.has(superSelector) && superAncestor !== acc.get(superSelector))
            throw new ReferenceError(`Different ancestor: ${superSelector}`);
        });
        return acc.merge(ancestor.ancestors).set(ancestor.selector, ancestor);
      },
      OrderedMap<string, ItmRecordFactory>()
    );
    // tslint:disable-next-line:max-line-length
    const serializer: ItmRecordFactory.Serializer<C, M> = typeof cfg.serializer === 'function' ? cfg.serializer : null;
    const model = ancestors
      .toStack()
      .map(ancestor => ancestor._model)
      .push(cfg.model)
      .reduce((acc, val) => acc === val ? val : ({...(acc as any || {}), ...(val || {})}));
    return new ItmRecordFactory(selector, ancestors, cfg.shared || {}, model, serializer);
  }

  private constructor(
    readonly selector: string,
    readonly ancestors: OrderedMap<string, ItmRecordFactory>,
    readonly shared: S,
    private readonly _model: M,
    private readonly _serializer: ItmRecordFactory.Serializer<C, M>
  ) {
    if (this.ancestors.has(selector)) throw new TypeError('Ancestors has selector');
    this._cfgFactory = Record(this._model);
  }

  isFactoryRecord(maybeRecord: any): boolean {
    return (
      Record.isRecord(maybeRecord) &&
      Record.getDescriptiveName(maybeRecord)
        .split(ItmRecordFactory.selectorSeparator)
        .includes(this.selector)
    );
  }

  serialize(...maybeCfgs: Partial<C>[]): R {
    if (maybeCfgs.length < 1) return null;
    if (maybeCfgs.length === 1 && this.isFactoryRecord(maybeCfgs[0])) return maybeCfgs[0] as any;
    // tslint:disable-next-line:max-line-length
    const rootCfg = maybeCfgs.reduce<RecordOf<C>>((acc, maybeCfg) => acc.mergeDeep(maybeCfg), this._cfgFactory());
    return this.ancestors.toSet()
      .add(this)
      .reduce<{ record: R, ancestors: Set<ItmRecordFactory> }>(
        ({record, ancestors}, factory) => {
          const unserializedAncestors = factory.ancestors.filter(anc => ancestors.has(anc));
          // tslint:disable-next-line:max-line-length
          if (!unserializedAncestors) throw new ReferenceError(`Some ancestors are not serialized : ${unserializedAncestors.map(anc => anc.selector).join(', ')}`);
          ancestors = ancestors.add(factory);
          const descriptiveName = ancestors
            .map(({selector}) => selector)
            .join(ItmRecordFactory.selectorSeparator);
          const serializer = factory._serializer;
          let model: R;
          if (serializer) try { model = serializer(rootCfg, record, this.shared) as R; }
          catch (err) {
            console.error('SERIALIZE ERROR', err);
            // tslint:disable-next-line:max-line-length
            console.error('SERIALIZE ERROR CONTEXT', {selector: this.selector, cfg: rootCfg.toJS()});
            throw err;
          }
          record = Record(this._model, descriptiveName)(
            model ? record.mergeDeep(model) : record
          ) as R;
          return {ancestors, record};
        },
        {record: this._cfgFactory() as R, ancestors: Set<ItmRecordFactory>()}
      )
      .record;
  }

  extend<CR extends R & RecordOf<CM>, CC extends Object, CM extends CC>(
    cfg: {
      selector: string,
      serializer?: ItmRecordFactory.Serializer<CC, CM, R>;
      model?: { [P in keyof CM]: null },
      shared?: S
    }
  ): ItmRecordFactory<CR, C & CC, any, S> {
    // tslint:disable-next-line:max-line-length
    if (cfg.shared && !(cfg.shared instanceof this.shared.constructor)) throw new TypeError('Expected shared with same constructor than parent');
    return ItmRecordFactory.build<CM, CC, any, C, S>({
      ...cfg, ancestors: [this] as [ItmRecordFactory<R, C, any, S>]
    });
  }

  getShared(
    factories: Collection<string, ItmRecordFactory>,
    record: R
  ): OrderedMap<string, S> {
    if (!this.isFactoryRecord(record)) throw new TypeError('Expected factory record');
    return ItmRecordFactory.getFactories(factories, record)
      .map(ancestor => ancestor.shared as S)
      .filter(shared => shared instanceof shared.constructor);
  }

  isExtendedFactory(factory: ItmRecordFactory<R, C, any, S>): boolean {
    return (
      factory instanceof ItmRecordFactory &&
      (!factory.shared || factory.shared instanceof this.shared.constructor)
    );
  }
}

export module ItmRecordFactory {
  export const selectorPattern = '[a-z]\\w+';
  export const selectorRegex = new RegExp(`^${ItmRecordFactory.selectorPattern}$`);
  export const selectorSeparator = ',';

  // tslint:disable-next-line:max-line-length
  export type Serializer<C extends Object = {}, M extends C = C, A extends RecordOf<Object> = RecordOf<Object>, S extends Object = {}> = (cfg: RecordOf<C>, ancestor?: A, shared?: S) => M;

  // tslint:disable-next-line:max-line-length
  export function getFactories<R extends RecordOf<M> = RecordOf<M>, C = {}, M extends C = C, S extends Object = {}>(
    factories: Collection<string, ItmRecordFactory<R, C, M, S>>,
    record: R
  ): OrderedMap<string, ItmRecordFactory<R, C, M, S>> {
    return Record.getDescriptiveName(record).split(ItmRecordFactory.selectorSeparator).reduce(
      (acc, selector) => {
        // tslint:disable-next-line:max-line-length
        if (!factories.has(selector)) throw new ReferenceError('Missing ItmRecordFactory with selector: ' + selector);
        return acc.set(selector, factories.get(selector));
      },
      OrderedMap<string, ItmRecordFactory<R, C, M, S>>()
    );
  }
}

export default ItmRecordFactory;
