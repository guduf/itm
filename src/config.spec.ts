import { Component } from '@angular/core';
import { List, Map } from 'immutable';

import Area from './area';
import Grid from './grid';
import Type from './type';
import Config from './config';

describe('ItmConfig', () => {
  @Component({template: ''})
  class TestComponent { }

  it('should create with a complete config', () => {
    const config = {
      defaultButtonComp: TestComponent,
      defaultControlComp: TestComponent,
      defaultFieldComp: TestComponent,
      defaultMenuComp: TestComponent,
      defaultTextComp: TestComponent,
      areaFactories: List([Area.factory]),
      gridFactories: List([Grid.factory]),
      types: Map({test: Type.factory.serialize({key: 'test'})})
    };
    expect(Config.factory.serialize(config)).toBeTruthy();
  });
});
