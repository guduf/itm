import Area from './area';
import GridArea from './grid-area';
import RecordFactory from './record-factory';
import { Map, RecordOf, Range } from 'immutable';

export module ItmGrid {
  export type Template = Map<number, Map<number, string>>;

  // tslint:disable-next-line:max-line-length
  export type AreasConfig<T = {}> = Area.Config<T>[] | { [selector: string]: Area.Config<T>[] } | Map<string, Map<string, Area.Config<T>>>;

  export interface Config<T = {}> {
    areas?: AreasConfig;
    template?: string | string[][] | Template;
    defaultSelector?: string;
  }

  export interface Model<T = {}> extends Config<T> {
    areas: Map<string, Map<string, Area.Record<T>>>;
    template: Template;
    defaultSelector?: string;
  }

  export type Record<T = {}> = RecordOf<Model<T>>;

  const serializer = (cfg: RecordOf<Config>): Model => {
    const template = parseTemplate(cfg.template);
    const areas = ItmGrid.parseAreas(cfg.areas);
    if (cfg.defaultSelector && !RecordFactory.selectorRegex.test(cfg.defaultSelector))
      throw new TypeError('Expected optionnal selector pattern as defaultSelector');
    const defaultSelector = cfg.defaultSelector || null;
    return {template, areas, defaultSelector};
  };

  const selector = 'grid';

  export const factory: RecordFactory<Record, Config> = RecordFactory.build({
    selector,
    serializer,
    model: {areas: null, template: null, defaultSelector: null}
  });

  export function parseAreas(cfg: AreasConfig): Map<string, Map<string, Area.Record>> {
    if (Array.isArray(cfg)) cfg = {[Area.selector]: cfg};
    const selectorsCfg: Map<string, Map<string, Area.Config>> = (
      Map.isMap(cfg) ? cfg :
        Map(cfg).map(areaCfgs => areaCfgs.reduce(
          (acc, areaCfg) => acc.set(areaCfg.key, areaCfg),
          Map<string, Area.Config>()
        ))
    );
    return selectorsCfg.map(
      selectors => selectors.map(areaCfg => Area.factory.serialize(areaCfg))
    );
  }

  // tslint:disable-next-line:max-line-length
  export function parseTemplate(cfg: string | string[][] | Template): Template {
    if (typeof cfg === 'string') cfg = cfg
      .split(/\s*\n+\s*/)
      .filter(rowTemplate => rowTemplate.length)
      .map((rowTemplate, i) => {
        const match = rowTemplate.match(templateRowRegExp);
        if (!match) throw new TypeError(`Expected Template row Regex: ${i}`);
        return match[1].split(/ +/);
      });
    if (Array.isArray(cfg)) cfg = cfg.reduce<Template>(
      (cfgAcc, fragments, row) => {
        const rowTemplate = fragments
          .reduce((rowAcc, fragment, col) => rowAcc.set(col, fragment), Map<number, string>());
        return cfgAcc.set(row, rowTemplate);
      },
      Map()
    );
    if (!Map.isMap(cfg)) throw new TypeError('Expected Template, Array or string');
    const colCount = cfg.reduce((max, row) => Math.max(max, row.size), 0);
    return Range(0, cfg.size)
      .flatMap(row => Range(0, colCount).map(col => ({row, col})))
      .reduce<Template>(
        (templateAcc, {row, col}) => {
          const prev = templateAcc.getIn([row, col - 1]) || null;
          let fragment = (cfg as Map<number, Map<number, string>>).getIn([row, col]) || null;
          if (fragment)
            // tslint:disable-next-line:max-line-length
            if (!fragmentRegExp.test(fragment)) throw new TypeError('Expected Area fragment pattern');
            else if (fragment.length < 2) fragment = fragment === '=' ? prev : null;
          return templateAcc.setIn([row, col], fragment);
        },
        Map()
      );
  }

  export const selectorCallPattern = `(?:${GridArea.selectorPattern}):${GridArea.keyPattern}`;
  export const fragmentPattern = `(?:(?:${GridArea.keyPattern})|(?:${selectorCallPattern})|=|\\.)`;
  export const fragmentRegExp = new RegExp(`^${fragmentPattern}$`);
  export const templateRowPattern = ` *(${fragmentPattern}(?: +${fragmentPattern})*) *`;
  export const templateRowRegExp = new RegExp(`^${templateRowPattern}$`);
}

export default ItmGrid;
