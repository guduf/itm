import { Injectable } from '@angular/core';
import { Map } from 'immutable';

import Area from './area';
import AreaFactory from './area_factory';
import Grid from './grid';
import GridFactory from './grid_factory';
import PipeSandbox from './pipe_sandbox';
import { from } from 'rxjs';
import { map, mergeMap, reduce } from 'rxjs/operators';

@Injectable()
export class ItmJsonRegistrer {
  constructor(
    private _pipeSandbox: PipeSandbox
  ) { }

  async buildGrid(grid: Grid.Config): Promise<Grid> {
    const {template} = grid;
    const areasCfg = (
      Array.isArray(grid.areas) ? {[Area.selector]: grid.areas} :
        grid.areas as { [selector: string]: Area.Config[] }
    );
    return from(Object.keys(areasCfg))
      .pipe(
        mergeMap(key => {
          return from(areasCfg[key]).pipe(
            mergeMap(cfg => this.buildArea(cfg)),
            reduce<Area, Map<string, Area>>((acc, area) => acc.set(area.key, area), Map()),
            map(areas => Map({[key]: areas}))
          );
        }),
        reduce((acc, val) => acc.merge(val)),
        map(areas => GridFactory({template, areas}))
      )
      .toPromise();
  }

  async buildArea(json: Area.Config): Promise<Area> {
    const {key, size} = json;
    let text: any = null;
    if (typeof json.text === 'string') {
      const pipeInput = ItmJsonRegistrer.parsePipeInput(json.text);
      text = await this._pipeSandbox.eval(pipeInput);
    }
    return AreaFactory({key, size, text});
  }
}

export module ItmJsonRegistrer {
  export function parsePipeInput(input: string): string {
    if (!input) return '() => null';
    if (/^\s*\([^\)]*\) => {.*}\s*$/.test(input)) return input;
    if (/^\s*`.*`\s*$/.test(input)) (
      input = input.replace(
        /\$\.[a-z]\w*(\.[a-z]\w*)*/g,
        match => {
          return ('${target' + match.slice(1) + '}');
        }
      )
    );
    return `target => (${input})`;
  }
}

export default ItmJsonRegistrer;
