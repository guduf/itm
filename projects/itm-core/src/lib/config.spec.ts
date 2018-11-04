import { Component } from '@angular/core';
import { List, Map } from 'immutable';

import AreaFactory from './area_factory';
import GridFactory from './grid_factory';
import TypeFactory from './type_factory';
import Config from './config';
import ConfigFactory from './config_factory';

describe('ItmConfig', () => {
  @Component({template: ''})
  class TestComponent { }

  const type = TypeFactory({key: 'test'});

  it('should create with a complete config', () => {
    const config: Config.ModelConfig = {
      defaultButtonComp: TestComponent,
      defaultControlComp: TestComponent,
      defaultFieldComp: TestComponent,
      defaultMenuComp: TestComponent,
      areaFactories: List([AreaFactory()]),
      gridFactories: List([GridFactory()]),
      types: Map({test: type})
    };
    expect(ConfigFactory(config)).toBeTruthy();
  });
});
