import { ItmAreaDef } from './area-def';
import { ItmAreaConfig } from './area-config';
import { Itm } from './item';
import { fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';

@Component({template: ''})
class HeaderComponent { }

@Component({template: ''})
class LabelComponent { }

@Component({template: ''})
class TextComponent { }

describe('ItmAreaDef', () => {
  it('should create with a minimal config', () => {
    expect(new ItmAreaDef({key: 'id'})).toBeTruthy();
  });

  it('should throw a error with invalid key is specified', () => {
    expect(() => new ItmAreaDef({key: null})).toThrowError(/InvalidItmAreaConfig/);
  });

  const item: Itm = {id: 63, firstName: 'Aron'};

  const expectedKey = 'name';
  const expectedGrow = 4;
  const expectedText = item.firstName;
  const expectedHeader = 'Name of user';
  const expectedLabel = 'Name';
  const expectedProvider = {provide: 'foo', useValue: 'FOO'};
  const expectedSize = 4;

  const config: ItmAreaConfig = {
    key: expectedKey,
    grow: expectedGrow,
    text: 'firstName',
    header: expectedHeader,
    label: expectedLabel,
    providers: [expectedProvider],
    size: expectedSize
  };

  it('should implements a valid config without components', fakeAsync(() => {
    const def = new ItmAreaDef(config);
    let renderedText: string;
    def.defaultText(item).subscribe(text => (renderedText = text));
    let renderedLabel: string;
    def.defaultLabel(item).subscribe(label => (renderedLabel = label));
    let renderedHeader: string;
    def.defaultHeader([item]).subscribe(header => (renderedHeader = header));
    tick();
    expect(def.key).toBe(expectedKey, 'Expected key');
    expect(def.grow).toBe(expectedGrow, 'Expected grow');
    expect(renderedText).toBe(expectedText, 'Expected text');
    expect(renderedLabel).toBe(expectedLabel, 'Expected label');
    expect(renderedHeader).toBe(expectedHeader, 'Expected header');
    expect(def.providers).toContain(expectedProvider, 'Expected provider');
    expect(def.size).toBe(expectedSize, 'Expected size');
  }));

  it('should implements a valid config with component', () => {
    const def = new ItmAreaDef({
      ...config,
      header: HeaderComponent,
      label: LabelComponent,
      text: TextComponent
    });
    expect(def.header).toBe(HeaderComponent);
    expect(def.label).toBe(LabelComponent);
    expect(def.text).toBe(TextComponent);
  });

  it('should has empty member when false is specified in config', () => {
    const defWithoutHeader = new ItmAreaDef({...config, header: false});
    expect(defWithoutHeader.header).toBeNull();
    expect(defWithoutHeader.defaultHeader).toBeFalsy();

    const defWithoutLabel = new ItmAreaDef({...config, label: false});
    expect(defWithoutLabel.label).toBeNull();
    expect(defWithoutLabel.defaultLabel).toBeFalsy();

    const defWithoutText = new ItmAreaDef({...config, text: false});
    expect(defWithoutText.text).toBeNull();
    expect(defWithoutText.defaultText).toBeFalsy();
  });
});
