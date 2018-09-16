import { ItmColumnDef } from './column';
import { Component } from '@angular/core';

@Component({template: ''})
class ItmCellComponent { }

describe('ItmColumnDef', () => {
  it('should create with the minimal config `{ key: "id" }`', () => {
    const def = new ItmColumnDef({key: 'id'});
    expect(def).toBeTruthy();
  });

  it('should throw a TypeError with a invalid [key] config', () => {
    expect(() => new ItmColumnDef({} as any)).toThrowError(TypeError, /^InvalidItm[\w]+Config.*/);
  });

  it('should set a component class as cell when provided in def', () => {
    const def = new ItmColumnDef({key: 'id', cell: ItmCellComponent});
    expect(def.cell).toBe(ItmCellComponent);
  });
});
