import { Map } from 'immutable';

import OptionsFactory from './options_factory';
import Registrer from './registrer';

describe('ItmRegistrer', () => {
  describe('new ItmRegistrer()', () => {
    it('should create with minimal', () => {
      const rgstr = new Registrer([{}]);
      expect(rgstr).toBeTruthy();
      // tslint:disable-next-line:max-line-length
      expect(OptionsFactory().isFactoryRecord(rgstr.options)).toBeTruthy('Expected options record');
      expect(Map.isMap(rgstr.areaFactories)).toBeTruthy('Expected map');
      expect(Map.isMap(rgstr.gridFactories)).toBeTruthy('Expected map');
      expect(Map.isMap(rgstr.types)).toBeTruthy('Expected map');
    });
  });
});
