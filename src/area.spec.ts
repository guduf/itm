import { Component } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { Map } from 'immutable';

import { ItmAreaConfig } from './area-config';
import Area from './area';
import { Itm, fromStringPipe } from './item';

@Component({template: ''})
class HeaderComponent { }

@Component({template: ''})
class LabelComponent { }

@Component({template: ''})
class CellComponent { }

describe('ItmArea', () => {
  it('should create with a minimal config', () => {
    expect(Area.factory.serialize({key: 'id'})).toBeTruthy();
  });

  it('should throw a error with invalid key is specified', () => {
    expect(() => Area.factory.serialize({key: null})).toThrowError(/InvalidItmAreaConfig/);
  });

  const item: Itm = {id: 63, firstName: 'Aron'};

  const expectedKey = 'name';
  const expectedGrow = 4;
  const expectedCell = item.firstName;
  const expectedProvider = {provide: 'foo', useValue: 'FOO'};
  const expectedSize = 4;

  const config: ItmAreaConfig = {
    key: expectedKey,
    grow: expectedGrow,
    cell: t => t['firstName'],
    providers: [expectedProvider],
    size: expectedSize
  };

  it('should implements a valid config without component', fakeAsync(() => {
    const def = Area.factory.serialize(config);
    let renderedText: string;
    fromStringPipe(def.text, item).subscribe(cell => (renderedText = cell));
    tick();
    expect(def.key).toBe(expectedKey, 'Expected key');
    expect(def.grow).toBe(expectedGrow, 'Expected grow');
    expect(renderedText).toBe(expectedCell, 'Expected cell');
    // tslint:disable-next-line:max-line-length
    expect(def.providers.equals(Map({[expectedProvider.provide]: expectedProvider.useValue}))).toBeTruthy('Expected provider');
    expect(def.size).toBe(expectedSize, 'Expected size');
  }));

  it('should implements a valid config with component', () => {
    const def = Area.factory.serialize({
      ...config,
      cell: CellComponent
    });
    expect(def.cell).toBe(CellComponent);
  });

  it('should has empty member when false is specified in config', () => {
    const defWithoutCell = Area.factory.serialize({...config, cell: false});
    expect(defWithoutCell.cell).toBeNull();
  });
});
