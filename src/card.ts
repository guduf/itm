import { Itm } from './item';
import { ItmAreaDef } from './area-def';
import { ItmAreaConfig } from './area-config';
import { isArray } from 'util';

export interface ItmCardConfig<I extends Itm = Itm> {
  areas?: (string | ItmAreaConfig<I>)[] | Map<string, ItmAreaConfig<I>>;
  size?: string | number | [string | number, string | number];
  template?: string | string[][];
  positions?: Map<string, [[number, number], [number, number]]>;
}

export class ItmCardDef<I extends Itm = Itm> implements ItmCardConfig<I> {
  readonly areas: Map<string, ItmAreaDef<I>>;
  readonly size: [number, number];
  readonly template: string[][];
  readonly positions: Map<string, [[number, number], [number, number]]>;

  constructor(cfg: ItmCardConfig<I>) {
    const areas = new Map<string, ItmAreaDef<I>>();
    cfg.areas = (
      Array.isArray(cfg.areas) ? cfg.areas :
      cfg.areas instanceof Map ? Array.from(cfg.areas.values()) :
      []
    );
    for (const columnCfg of cfg.areas) {
      const columnDef = new ItmAreaDef(
        typeof columnCfg === 'string' ? {key: columnCfg} : columnCfg
      );
      areas.set(columnDef.key, columnDef);
    }
    this.areas = areas;
    const {template, positions} = this._parseTemplate(cfg.template);
    this.template = template;
    this.positions = positions;
    this.size = this._parseSize(cfg.size);
  }

  private _parseTemplate(
    cardTemplate: string | string[][]
  ): { template: string[][], positions: Map<string, [[number, number], [number, number]]> } {
    const positions = new Map<string, [[number, number], [number, number]]>();
    if (typeof cardTemplate === 'string') {
      const templateRegex = /^\s*((?:\s*(?: *(?:[\w\.][\w\.\=\ ]+) *)\n{0,1}?)+)\s*$/;
      const match = (cardTemplate + '\n').match(templateRegex);
      if (!match) return {template: [[]], positions};
      cardTemplate = [];
      for (const rowTemplate of match[1].split(/\s*\n+\s*/g))
        cardTemplate.push(rowTemplate.split(/\s+/g));
    }
    else if (!Array.isArray(cardTemplate)) return {template: [[]], positions};
    const rowCount = cardTemplate.length;
    const columnCount = cardTemplate.reduce((max, row) => Math.max(max, row.length), 0);
    const template: string[][] = [];
    for (let row = 0; row < rowCount; row++) for (let col = 0; col < columnCount; col++) {
      if (!col) template.push([]);
      const prev = template[row][col - 1];
      let cell = cardTemplate[row][col];
      if (!cell || cell === '.' || (cell === '=' && !col)) cell = '.';
      else if (cell === '=') cell = prev;
      if (cell !== '.' && !this.areas.has(cell))
        throw new TypeError(`InvalidCellArea: ${cell}`);
      if (
        prev && prev !== cell && positions.has(prev) &&
        (col <= positions.get(prev)[1][1])
      ) throw new TypeError('Invalid template: Area not closed ' + cell);
      if (cell !== '.')
        if (!positions.has(cell)) positions.set(cell, [[row, col], [row, col]]);
        else {
          const [[startRow, startCol], [endRow, endCol]] = positions.get(cell);
          if (endRow !== row && startCol !== col)
            throw new TypeError('Invalid template: Area wrong column start' + cell);
          if (prev !== cell || endCol >= col)
            throw new TypeError('Invalid template: Area wrong end' + cell);
          positions.set(cell, [[startRow, startCol], [endRow, Math.max(col, endCol)]]);
        }
      template[row][col] = cell;
    }
    return {template, positions};
  }

  private _parseSize(size: string | number | [string | number, string | number]): [number, number] {
    if (typeof size === 'string') {
      const match = size.match(/^(\d+)(?: (\d+))?$/);
      size = match ? [match[1], match[2] || match[1]] : null;
    }
    if (!Array.isArray(size)) return [this.template[0].length, this.template.length];
    const columns = size[0] > 0 ? Math.round(+size[0]) : this.template[0].length;
    return [columns, size[1] > 0 ? Math.round(+size[1]) : this.template.length];
  }
}
