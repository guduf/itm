import { Component } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

import { ItmPropAreaConfig } from './area-config';
import { ItmPropAreaDef } from './area-def';
import { Itm } from './item';

@Component({template: ''})
class HeaderComponent { }

@Component({template: ''})
class LabelComponent { }

@Component({template: ''})
class CellComponent { }

describe('ItmPropAreaDef', () => {
  it('should create with a minimal config', () => {
    expect(new ItmPropAreaDef({key: 'id'})).toBeTruthy();
  });

  it('should throw a error with invalid key is specified', () => {
    expect(() => new ItmPropAreaDef({key: null})).toThrowError(/InvalidItmAreaConfig/);
  });

  const item: Itm = {id: 63, firstName: 'Aron'};

  const expectedKey = 'name';
  const expectedGrow = 4;
  const expectedCell = item.firstName;
  const expectedHeader = 'Name of user';
  const expectedLabel = 'Name';
  const expectedProvider = {provide: 'foo', useValue: 'FOO'};
  const expectedSize = 4;

  const config: ItmPropAreaConfig = {
    key: expectedKey,
    grow: expectedGrow,
    cell: 'firstName',
    header: expectedHeader,
    label: expectedLabel,
    providers: [expectedProvider],
    size: expectedSize
  };

  it('should implements a valid config without components', fakeAsync(() => {
    const def = new ItmPropAreaDef(config);
    let renderedText: string;
    def.defaultText(item).subscribe(cell => (renderedText = cell));
    let renderedLabel: string;
    def.defaultLabel(item).subscribe(label => (renderedLabel = label));
    let renderedHeader: string;
    def.defaultHeader([item]).subscribe(header => (renderedHeader = header));
    tick();
    expect(def.key).toBe(expectedKey, 'Expected key');
    expect(def.grow).toBe(expectedGrow, 'Expected grow');
    expect(renderedText).toBe(expectedCell, 'Expected cell');
    expect(renderedLabel).toBe(expectedLabel, 'Expected label');
    expect(renderedHeader).toBe(expectedHeader, 'Expected header');
    expect(def.providers).toContain(expectedProvider, 'Expected provider');
    expect(def.size).toBe(expectedSize, 'Expected size');
  }));

  it('should implements a valid config with component', () => {
    const def = new ItmPropAreaDef({
      ...config,
      header: HeaderComponent,
      label: LabelComponent,
      cell: CellComponent
    });
    expect(def.header).toBe(HeaderComponent);
    expect(def.label).toBe(LabelComponent);
    expect(def.cell).toBe(CellComponent);
  });

  it('should has empty member when false is specified in config', () => {
    const defWithoutHeader = new ItmPropAreaDef({...config, header: false});
    expect(defWithoutHeader.header).toBeNull();
    expect(defWithoutHeader.defaultHeader).toBeFalsy();

    const defWithoutLabel = new ItmPropAreaDef({...config, label: false});
    expect(defWithoutLabel.label).toBeNull();
    expect(defWithoutLabel.defaultLabel).toBeFalsy();

    const defWithoutCell = new ItmPropAreaDef({...config, cell: false});
    expect(defWithoutCell.cell).toBeNull();
    expect(defWithoutCell.defaultText).toBeFalsy();
  });
});
