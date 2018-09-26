import { ItmColumn } from './column';
import { Component } from '@angular/core';

@Component({template: ''})
class ItmCellComponent { }

describe('ItmColumn', () => {
  it('should create with the minimal config `{ key: "id" }`', () => {
    const def = new ItmColumn({key: 'id'});
    expect(def).toBeTruthy();
  });

  it('should throw a TypeError with a invalid [key] config', () => {
    expect(() => new ItmColumn({} as any)).toThrowError(TypeError, /^InvalidItm[\w]+Config.*/);
  });

  it('should set a component class as cell when provided in def', () => {
    const def = new ItmColumn({key: 'id', cell: ItmCellComponent});
    expect(def.cell).toBe(ItmCellComponent);
  });
});
