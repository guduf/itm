import { ItmColumnDef } from './column';

describe('ItmColumnDef', () => {
  it('should create with the minimal config `{ key: "id" }`', () => {
    const def = new ItmColumnDef({key: 'id'});
    expect(def).toBeTruthy();
  });

  it('should throw a TypeError with a invalid [key] config', () => {
    expect(() => new ItmColumnDef({} as any)).toThrowError(TypeError, /^InvalidItmColumnConfig.*/);
  });
});
