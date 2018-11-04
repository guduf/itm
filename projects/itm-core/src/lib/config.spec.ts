import { Component } from '@angular/core';
import { List, Map } from 'immutable';

import Area from './area';
import Grid from './grid';
import Type from './type';
import Config from './config';

describe('ItmConfig', () => {
  @Component({template: ''})
  class TestComponent { }

  const type = Type.factory.serialize({key: 'test'});

  it('should create with a complete config', () => {
    const config: Config.ModelConfig = {
      defaultButtonComp: TestComponent,
      defaultControlComp: TestComponent,
      defaultFieldComp: TestComponent,
      defaultMenuComp: TestComponent,
      areaFactories: List([Area.factory]),
      gridFactories: List([Grid.factory]),
      types: Map({test: type})
    };
    expect(Config.factory.serialize(config)).toBeTruthy();
  });
});
