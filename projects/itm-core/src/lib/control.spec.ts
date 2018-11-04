import AreaFactory from './area_factory';
import ControlFactory from './control_factory';

describe('ItmControlFactory', () => {
  it('should return a record factory or a record', () => {
    const recordFactory = ControlFactory();
    expect(AreaFactory().isExtendedFactory(recordFactory)).toBeTruthy('Expected record factory.');
    const record = ControlFactory({key: 'foo'});
    expect(recordFactory.isFactoryRecord(record)).toBeTruthy('Expected record.');
  });
});
