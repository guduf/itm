import { Component } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import Area from './area';
import AreaFactory from './area_factory';
import Target from './target';

@Component({template: ''})
class CompComponent { }

describe('ItmArea', () => {
  it('should create with a minimal config', () => {
    expect(AreaFactory({key: 'id'})).toBeTruthy();
  });

  it('should throw a error with invalid key is specified', () => {
    expect(() => AreaFactory({key: null})).toThrowError(/key/);
  });

  const item = {id: 63, firstName: 'Aron'};

  const expectedKey = 'name';
  const expectedComp = item.firstName;

  const config: Area.Config = {
    key: expectedKey,
    text: t => t['firstName'],
  };

  it('should implements a valid config without component', fakeAsync(() => {
    const record = AreaFactory(config);
    let renderedText: string;
    Target.map(of(item), record.text).subscribe(comp => (renderedText = comp));
    tick();
    expect(record.key).toBe(expectedKey, 'Expected key');
    expect(renderedText).toBe(expectedComp, 'Expected comp');
  }));

  it('should implements a valid config with component', () => {
    const def = AreaFactory({
      ...config,
      comp: CompComponent
    });
    expect(def.comp).toBe(CompComponent);
  });

  it('should has empty member when false is specified in config', () => {
    const defWithoutComp = AreaFactory({...config, comp: false});
    expect(defWithoutComp.comp).toBeNull();
  });
});
