import { RecordOf, Record, OrderedMap, Collection, Map, Set, isCollection } from 'immutable';

// tslint:disable-next-line:max-line-length
export class ItmRecordFactory<R extends RecordOf<M> = RecordOf<M>, C = {}, M extends C = C, S extends Object = {}> {
  mappers: Map<string, (val: any) => any>;
  model: M;

  private readonly _cfgFactory: Record.Factory<C>;

  static build<M extends C, C extends Object, S extends Object>(
    cfg: {
      selector: string,
      shared?: S,
      normalize?: ItmRecordFactory.Serializer<C, M, null, S>,
      model?: ItmRecordFactory.ModelMapper<M>,
      ancestors?: never
    }
  ): ItmRecordFactory<RecordOf<M>, C, M, S>;

  // tslint:disable-next-line:max-line-length
  static build<M extends C, C extends Object, AR extends RecordOf<AC>, AC extends Object = {}, S extends Object = {}>(
    cfg: {
      selector: string,
      shared?: S,
      normalize?: ItmRecordFactory.Serializer<C, M, AR, S>,
      model?: ItmRecordFactory.ModelMapper<M>,
      ancestors: [ItmRecordFactory<AR, AC>]
    }
  ): ItmRecordFactory<AR & RecordOf<M>, AC & C, any, S>;

  // tslint:disable-next-line:max-line-length
  static build<R1 extends RecordOf<M1>, C1 extends Object, M1 extends C1, R2 extends RecordOf<M2>, C2 extends Object, M2 extends C2, S extends Object = {}>(
    cfg: {
      selector: string,
      shared?: S,
      normalize?: never,
      model?: never,
      ancestors: [ItmRecordFactory<R1, C1>, ItmRecordFactory<R2, C2>]
    }
  ): ItmRecordFactory<R1 & R2, C1 & C2, any, S>;

  static build<M extends C, C extends Object>(
    cfg: {
      selector: string;
      shared?: any;
      normalize?: ItmRecordFactory.Serializer<C, M, RecordOf<any>, any>;
      model?: ItmRecordFactory.ModelMapper<M>;
      ancestors?: ItmRecordFactory[];
    }
  ): ItmRecordFactory<RecordOf<M>, C, any, any> {
    // tslint:disable-next-line:max-line-length
    if (!ItmRecordFactory.selectorRegex.test(cfg.selector)) throw new TypeError('Expected selector pattern');
    const selector = cfg.selector;
    // tslint:disable-next-line:max-line-length
    if (cfg.normalize && !cfg.model) throw new TypeError('Expected model when normalize is specified');
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
    const normalize: ItmRecordFactory.Serializer<C, M> = typeof cfg.normalize === 'function' ? cfg.normalize : null;
    const modelMappers = typeof cfg.model === 'object' ? cfg.model : null;
    return new ItmRecordFactory(selector, ancestors, cfg.shared || {}, normalize, modelMappers);
  }

  private constructor(
    readonly selector: string,
    readonly ancestors: OrderedMap<string, ItmRecordFactory>,
    readonly shared: S,
    private readonly _normalizer: ItmRecordFactory.Serializer<C, M>,
    modelMappers: ItmRecordFactory.ModelMapper<M>
  ) {
    if (this.ancestors.has(selector)) throw new TypeError('Ancestors has selector');
    const {mappers: ancestorsMappers, model: ancestorsModel} = this.ancestors.reduce(
      (acc, ancestor) => ({
        mappers: acc.mappers.merge(ancestor.mappers),
        model: {...(acc.model as {}), ...ancestor.model} as M
      }),
      {mappers: Map<string, (val: any) => any>(), model: {} as M}
    );
    if (modelMappers) {
      const {mappers, model} = Object.keys(modelMappers).reduce(
        (acc, key) => ({
          mappers: (
            typeof modelMappers[key] === 'function' ? acc.mappers.set(key, modelMappers[key]) :
              acc.mappers
          ),
          model: {...(acc.model as {}), [key]: null} as M
        }),
        {mappers: ancestorsMappers, model: ancestorsModel}
      );
      this.model = model;
      this.mappers = mappers;
    }
    else {
      this.model = ancestorsModel;
      this.mappers = ancestorsMappers;
    }
    this._cfgFactory = Record(this.model);
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
    const rootCfg = maybeCfgs.reduce<RecordOf<C>>(
      (acc, maybeCfg) => {
        if (!maybeCfg || typeof maybeCfg !== 'object') return acc;
        if (this.isFactoryRecord(maybeCfg)) return acc.mergeDeep(maybeCfg);
        const keys = (
          Record.isRecord(maybeCfg) ? Object.keys((maybeCfg as RecordOf<any>).toJS()) :
          isCollection(maybeCfg) ? Object.keys((maybeCfg as Collection<any, any>).toJS()) :
            Object.keys(maybeCfg)
        );
        const mappedCfg = keys.reduce(
          (cfgAcc, key) => {
            if (typeof this.model[key] === 'undefined') return cfgAcc;
            if (!this.mappers.has(key)) return {...(cfgAcc as {}), [key]: maybeCfg[key]};
            let mapped: any;
            try { mapped = this.mappers.get(key)(maybeCfg[key]); }
            catch (err) {
              console.error('MODEL MAPPER ERROR', err);
              // tslint:disable-next-line:max-line-length
              console.error('MODEL MAPPER ERROR CONTEXT', {selector: this.selector, cfg: maybeCfg});
            }
            return {...(cfgAcc as {}), [key]: mapped};
          },
          {} as Partial<C>
        );
        return acc.mergeDeep(mappedCfg);
      },
      this._cfgFactory()
    );
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
          const normalizer = factory._normalizer;
          let model: R;
          if (normalizer) try { model = normalizer(rootCfg, record, this.shared) as R; }
          catch (err) {
            console.error('NORMALIZE ERROR', err);
            // tslint:disable-next-line:max-line-length
            console.error('NORMALIZE ERROR CONTEXT', {selector: this.selector, cfg: rootCfg.toJS()});
            throw err;
          }
          record = Record(this.model as M, descriptiveName)(
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
      normalize?: ItmRecordFactory.Serializer<CC, CM, R>;
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
    factories: Collection<string, ItmRecordFactory<R, any, any, S>>,
    record: R
  ): OrderedMap<string, S> {
    if (!this.isFactoryRecord(record)) throw new TypeError('Expected factory record');
    return ItmRecordFactory.getFactories(factories, record)
      .map(ancestor => (ancestor ? ancestor.shared : null) as S)
      .filter(shared => shared && shared instanceof this.shared.constructor);
  }

  isExtendedFactory(factory: ItmRecordFactory<R, C, any, S>): boolean {
    return (
      factory instanceof ItmRecordFactory &&
      (!factory.shared || factory.shared instanceof this.shared.constructor)
    );
  }
}

export module ItmRecordFactory {
  // tslint:disable-next-line:max-line-length
  export type Serializer<C extends Object = {}, M extends C = C, A extends RecordOf<Object> = RecordOf<Object>, S extends Object = {}> = (cfg: RecordOf<C>, ancestor?: A, shared?: S) => M;

  export type ModelMapper<C extends Object = {}, M extends C = C> = (
    { [P in keyof C]: (val: any) => C[P] | null; } &
    { [P in keyof M]: (val: any) => any | null; }
  );

  // tslint:disable-next-line:max-line-length
  export function getFactories<R extends RecordOf<M> = RecordOf<M>, C = {}, M extends C = C, S extends Object = {}>(
    factories: Collection<string, ItmRecordFactory<R, C, M, S>>,
    record: R
  ): OrderedMap<string, ItmRecordFactory<R, C, M, S>> {
    return Record.getDescriptiveName(record).split(ItmRecordFactory.selectorSeparator).reduce(
      (acc, selector) => acc.set(selector, factories.get(selector, null)),
      OrderedMap<string, ItmRecordFactory<R, C, M, S>>()
    );
  }

  export const selectorPattern = '[a-z]\\w+';
  export const selectorRegex = new RegExp(`^${ItmRecordFactory.selectorPattern}$`);
  export const selectorSeparator = ',';
}

export default ItmRecordFactory;
