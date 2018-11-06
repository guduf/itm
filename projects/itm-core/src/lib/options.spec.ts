import { Component } from '@angular/core';
import { List, Map } from 'immutable';

import AreaFactory from './area_factory';
import GridFactory from './grid_factory';
import TypeFactory from './type_factory';
import Options from './options';
import OptionsFactory from './options_factory';

describe('ItmOptions', () => {
  @Component({template: ''})
  class TestComponent { }

  const type = TypeFactory({key: 'test'});

  it('should create with a complete config', () => {
    const options: Options.Config = {
      defaultButtonComp: TestComponent,
      defaultControlComp: TestComponent,
      defaultFieldComp: TestComponent,
      defaultMenuComp: TestComponent,
      areaFactories: List([AreaFactory()]),
      gridFactories: List([GridFactory()]),
      types: Map({test: type})
    };
    expect(OptionsFactory(options)).toBeTruthy();
  });
});
