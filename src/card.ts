import { Component, Input } from '@angular/core';

import { Itm, ItmPipeLike } from './item';
import { ComponentType } from './utils';

export interface ItmCardArea<I extends Itm = Itm> {
  /** The unique identifier of card area. */
  key: keyof I;

  /**
   * The cell to display in the card area.
   * In case of component class, the value is used by the component factory.
   * In case of string, the value is used as the attribute for default cell. */
  cell?: ItmPipeLike<I, string> | ComponentType | false;

  /**
   * The component displayed in MatHeaderCell.
   * In case of component class, the value is used by the component factory.
   * In case of string, the value is used as the attribute for default header cell.
   * In case of false, none header is displayed. */
  header?: ItmPipeLike<I[], string> | ComponentType | false;
}

@Component({
  selector: 'itm-card',
  template: `
    <div *ngFor="let area of areas" [itmCardArea]="item" [area]="area"></div>
    `
})
export class ItmCardComponent<I extends Itm = Itm> {
  @Input()
  item: I;

  @Input()
  template: string | string[];

  areas: ItmCardArea[];
}
