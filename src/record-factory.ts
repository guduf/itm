import { RecordOf, Record, OrderedMap, Collection, Set } from 'immutable';

export class ItmRecordFactory<
  R extends RecordOf<M> = RecordOf<M>,
  C = {},
  M extends C = C
> {
  private _cfgFactory: Record.Factory<C>;

  static build<M extends C = C, C extends Object = {}>(
    cfg: {
      selector: string,
      serializer?: (cfg: RecordOf<C>) => M,
      model?: { [P in keyof M]: null },
      ancestors?: never
    }
  ): ItmRecordFactory<RecordOf<M>, C>;

  // tslint:disable-next-line:max-line-length
  static build<M extends C, C extends Object, AR extends FC & RecordOf<FC>, FC extends Object = {}>(
    cfg: {
      selector: string,
      serializer?: (cfg: RecordOf<C>, ancestor: AR) => M,
      model?: { [P in keyof M]: null },
      ancestors: [ItmRecordFactory<AR, FC>]
    }
  ): ItmRecordFactory<AR & RecordOf<M>, FC & C, any>;

  // tslint:disable-next-line:max-line-length
  static build<R1 extends RecordOf<M1>, C1 extends Object, M1 extends C1, R2 extends RecordOf<M2>, C2 extends Object, M2 extends C2>(
    cfg: {
      selector: string,
      ancestors: [ItmRecordFactory<R1, C1>, ItmRecordFactory<R2, C2>]
    }
  ): ItmRecordFactory<R1 & R2, C1 & C2, any>;

  static build<M extends C = C, C = {}>(
    cfg: {
      selector: string;
      serializer?: (cfg: RecordOf<C>, ancestor?: RecordOf<any>) => M;
      model?: { [P in keyof M]: null };
      ancestors?: ItmRecordFactory[];
    }
  ): ItmRecordFactory<RecordOf<M>, C> {
    // tslint:disable-next-line:max-line-length
    if (!ItmRecordFactory.selectorRegex.test(cfg.selector)) throw new TypeError('Expected selector pattern');
    const selector = cfg.selector;
    // tslint:disable-next-line:max-line-length
    if (cfg.serializer && !cfg.model) throw new TypeError('Expected model when serializer is specified');
    const ancestors = Collection(cfg.ancestors).reduce(
      (acc, ancestor) => {
        // tslint:disable-next-line:max-line-length
        if (!(ancestor instanceof ItmRecordFactory)) throw new TypeError('Expected ItmRecordFactory');
        ancestor._ancestors.forEach((superAncestor, superSelector) => {
          if (acc.has(superSelector) && superAncestor !== acc.get(superSelector))
            throw new ReferenceError(`Different ancestor: ${superSelector}`);
        });
        return acc.merge(ancestor._ancestors).set(ancestor.selector, ancestor);
      },
      OrderedMap<string, ItmRecordFactory>()
    );
    // tslint:disable-next-line:max-line-length
    const serializer: (cfg: RecordOf<C>) => M = typeof cfg.serializer === 'function' ? cfg.serializer : null;
    const model = ancestors
      .toStack()
      .map(ancestor => ancestor._model)
      .push(cfg.model)
      .reduce((acc, val) => acc === val ? val : ({...(acc as any || {}), ...(val || {})}));
    return new ItmRecordFactory(selector, ancestors, model, serializer);
  }

  private constructor(
    readonly selector: string,
    private readonly _ancestors: OrderedMap<string, ItmRecordFactory>,
    private readonly _model: M,
    private readonly _serializer?: (cfg: RecordOf<C>, ancestor?: RecordOf<any>) => M
  ) {
    if (this._ancestors.has(selector)) throw new TypeError('Ancestors has selector');
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
    return this._ancestors.toSet()
      .add(this)
      .reduce<{ record: R, ancestors: Set<ItmRecordFactory> }>(
        ({record, ancestors}, factory) => {
          const unserializedAncestors = factory._ancestors.filter(anc => ancestors.has(anc));
          // tslint:disable-next-line:max-line-length
          if (!unserializedAncestors) throw new ReferenceError(`Some ancestors are not serialized : ${unserializedAncestors.map(anc => anc.selector).join(', ')}`);
          ancestors = ancestors.add(factory);
          const descriptiveName = ancestors
            .map(({selector}) => selector)
            .join(ItmRecordFactory.selectorSeparator);
          const serializer = factory._serializer;
          let model: R;
          if (serializer) try {
            model = serializer(rootCfg, record) as R;
          }
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
}

export module ItmRecordFactory {
  export const selectorPattern = '[a-z]\\w+';
  export const selectorRegex = new RegExp(`^${ItmRecordFactory.selectorPattern}$`);
  export const selectorSeparator = ',';
}

export default ItmRecordFactory;
