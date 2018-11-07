import Reflector, { ItmTypeDecorator} from './reflector';
import Type from './type';

describe('ItmReflector', () => {
  describe('provide()', () => {
    it('should provide with minimal', () => {
      const provider = Reflector.provide();
      const init = provider.useFactory();
      console.log(init);
      expect(init && Array.isArray(init.types)).toBeTruthy('Expected array');
    });

    it('should filter failed types reflection', () => {
      @ItmTypeDecorator({})
      class Item { }

      const provider = Reflector.provide(Item, Date);
      const {types}: { types: Type[] } = provider.useFactory();
      expect(types.length).toBe(1);
      expect(types[0].target).toBe(Item);
    });
  });
});
