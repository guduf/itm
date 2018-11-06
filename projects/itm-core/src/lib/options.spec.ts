import { Component } from '@angular/core';

import Options from './options';
import OptionsFactory from './options_factory';

describe('ItmOptions', () => {
  @Component({template: ''})
  class TestComponent { }

  it('should create with a complete config', () => {
    const options: Options.Config = {
      defaultButtonComp: TestComponent,
      defaultControlComp: TestComponent,
      defaultFieldComp: TestComponent,
      defaultMenuComp: TestComponent
    };
    expect(OptionsFactory(options)).toBeTruthy();
  });
});
