import Button from './button';
import Menu from './menu';
import MenuRecordFactory from './menu_factory';
import { of } from 'rxjs';

describe('ItmMenuRecordFactory', () => {
  describe('normalize()', () => {
    it('should normalize minimal config', () => {
      expect(MenuRecordFactory.normalize({})).toBeTruthy();
    });

    it('should normalize complete config', () => {
      const expectedKey = 'foo';
      const expectedMode = Button.Mode.menu;
      const config: Menu.ModelConfig = {
        buttons: [{key: expectedKey}],
        mode: expectedMode,
        direction: () => of(Menu.Direction.bottom)
      };
      expect(MenuRecordFactory.normalize(config)).toBeTruthy();
    });
  });
});
