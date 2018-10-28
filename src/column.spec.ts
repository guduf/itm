import { Component } from '@angular/core';

import Column from './column';

describe('ItmColumn', () => {
  @Component({template: ''})
  class ItmCellComponent { }

  it('should create with the minimal config `{ key: "id" }`', () => {
    const def = Column.factory.serialize({key: 'id'});
    expect(def).toBeTruthy();
  });

  it('should throw a TypeError with a invalid [key] config', () => {
    // tslint:disable-next-line:max-line-length
    expect(() => Column.factory.serialize({} as any)).toThrowError(TypeError, /key/);
  });

  it('should set a component class as comp when provided in def', () => {
    const def = Column.factory.serialize({key: 'id', comp: ItmCellComponent});
    expect(def.comp).toBe(ItmCellComponent);
  });
});
