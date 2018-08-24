import { ItmColumnDef } from './column-def';
import { Component } from '@angular/core';

describe('ItmColumnDef', () => {
  it('should create with the minimal config `{ key: "id" }`', () => {
    const def = new ItmColumnDef({key: 'id'});
    expect(def).toBeTruthy();
  });

  it('should throw a TypeError with a invalid [key] config', () => {
    expect(() => new ItmColumnDef({} as any)).toThrowError(TypeError, /^InvalidItmColumnConfig.*/);
  });

  it('should set a component class as cell when provided in def', () => {
    @Component({template: ''})
    class ItmCell { }
    const def = new ItmColumnDef({key: 'id', cell: ItmCell});
    expect(def.cell).toBe(ItmCell);
  });
});
