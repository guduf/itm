import ItmRecordFactory from './record_factory';
import { Record, RecordOf } from 'immutable';

const modelTestImplImplSelector = 'testImpl';

class ModelTestImpl {
  key: string;

  constructor({key}: ModelTestImpl) {
    if (!key || typeof key !== 'string') throw new TypeError('Expected string');
    this.key = key;
  }
}

interface ChildModelTestConfig extends ModelTestImpl { suffix: string; }

interface ChildModelTestImpl extends ChildModelTestConfig { childKey: string; }

const childModelTestImplImplSelector = 'childTestImpl';

const normalize = (
  {key, suffix}: RecordOf<ModelTestImpl & ChildModelTestConfig>
): ChildModelTestImpl => {
  if (!suffix || typeof suffix !== 'string') throw new TypeError('Expected string');
  return {key, suffix, childKey: key + suffix};
};

describe('ItmRecordFactory', () => {
  function setup<T extends C = C, C extends Object = {}>(
    // tslint:disable-next-line:max-line-length
    {ancestors, selector, normalize, model}: any = {},
  ): ItmRecordFactory<RecordOf<T>, C> {
    if (typeof selector === 'undefined') selector = modelTestImplImplSelector;
    if (typeof normalize === 'undefined') normalize = cfg => new ModelTestImpl(cfg as any) as any;
    if (typeof model === 'undefined') model = {key: null} as any;
    return ItmRecordFactory.build({selector, normalize, model, ancestors}) as any;
  }

  it('should create with minimal config', () => {
    const factory = setup();
    expect(factory instanceof ItmRecordFactory).toBeTruthy('Expected ItmRecordFactory');
    expect(factory.selector).toBe(modelTestImplImplSelector, 'Expected same selector');
  });

  it('should create a record with the expected key', () => {
    const key = 'foo';
    const record = setup<ModelTestImpl>().serialize({key});
    expect(Record.isRecord).toBeTruthy('Expected record');
    expect(Record.getDescriptiveName(record).split(','))
      .toContain(modelTestImplImplSelector, 'Expected to contains selector');
    expect(record.key).toBe(key);
  });

  it('should create with ancestor', () => {
    const key = 'foo';
    const suffix = 'bar';
    const ancestor = setup<ModelTestImpl>();
    const factory = setup<ChildModelTestImpl, ChildModelTestConfig>(
      {
        selector: childModelTestImplImplSelector,
        normalize,
        model: {key: null, childKey: null, suffix: null},
        ancestors: [ancestor]
      }
    );
    const record = factory.serialize({key, suffix});
    expect(Record.isRecord).toBeTruthy('Expected record');
    expect(Record.getDescriptiveName(record).split(','))
      .toEqual([ancestor.selector, factory.selector], 'Expected to contains selector');
    expect(record.key).toBe(key);
    expect(record.childKey).toBe(key + suffix);
  });

  it('should throw a error when selector is not pattern', () => {
    expect(() => setup({selector: '$é'})).toThrowError(/Expected selector pattern/i);
  });

  it('should throw a error when model is not specified while normalize is', () => {
    expect(() => setup({model: null})).toThrowError(/Expected model when normalize is specified/i);
  });
});
