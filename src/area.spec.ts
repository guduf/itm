import { Component } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

import { ItmAreaConfig } from './area-config';
import { ItmArea } from './area';
import { Itm } from './item';

@Component({template: ''})
class HeaderComponent { }

@Component({template: ''})
class LabelComponent { }

@Component({template: ''})
class CellComponent { }

describe('ItmArea', () => {
  it('should create with a minimal config', () => {
    expect(new ItmArea({key: 'id'})).toBeTruthy();
  });

  it('should throw a error with invalid key is specified', () => {
    expect(() => new ItmArea({key: null})).toThrowError(/InvalidItmAreaConfig/);
  });

  const item: Itm = {id: 63, firstName: 'Aron'};

  const expectedKey = 'name';
  const expectedGrow = 4;
  const expectedCell = item.firstName;
  const expectedHeader = 'Name of user';
  const expectedLabel = 'Name';
  const expectedProvider = {provide: 'foo', useValue: 'FOO'};
  const expectedSize = 4;

  const config: ItmAreaConfig = {
    key: expectedKey,
    grow: expectedGrow,
    cell: 'firstName',
    providers: [expectedProvider],
    size: expectedSize
  };

  it('should implements a valid config without components', fakeAsync(() => {
    const def = new ItmArea(config);
    let renderedText: string;
    def.defaultText(item).subscribe(cell => (renderedText = cell));
    tick();
    expect(def.key).toBe(expectedKey, 'Expected key');
    expect(def.grow).toBe(expectedGrow, 'Expected grow');
    expect(renderedText).toBe(expectedCell, 'Expected cell');
    expect(def.providers).toContain(expectedProvider, 'Expected provider');
    expect(def.size).toBe(expectedSize, 'Expected size');
  }));

  it('should implements a valid config with component', () => {
    const def = new ItmArea({
      ...config,
      cell: CellComponent
    });
    expect(def.cell).toBe(CellComponent);
  });

  it('should has empty member when false is specified in config', () => {
    const defWithoutCell = new ItmArea({...config, cell: false});
    expect(defWithoutCell.cell).toBeNull();
    expect(defWithoutCell.defaultText).toBeFalsy();
  });
});
