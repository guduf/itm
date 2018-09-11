// tslint:disable-next-line:max-line-length
import { Component, EventEmitter, OnChanges, Input, SimpleChanges, HostBinding, Output } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { ItmActionEvent } from './action';
import { ItmAreaDef } from './area-def';
import { ItmCardConfig, ItmCardDef } from './card';
import { Itm } from './item';

/** The selector of ItmCardComponent. */
const SELECTOR = 'itm-card';

@Component({
  selector: SELECTOR,
  template: `
    <div *ngFor="let area of displayedAreas"
      [class]="getCellClass()" [style.grid-area]="getCellPosition(area)">
      <ng-container [itmCardArea]="areas.get(area)" [item]="item" [actionEmitter]="action">
      </ng-container>
    </div>
  `
})
export class ItmCardComponent<I extends Itm = Itm> implements OnChanges {
  @Input()
  /** The configuration of the card. */
  card: ItmCardConfig<I>;

  @Input()
  /** The target item of the card. */
  item: I;

  @Output()
  /** The emitter of action events. */
  action = new EventEmitter<ItmActionEvent<I>>();

  /** The displayable ares of the card. */
  areas: Map<string, ItmAreaDef<I>>;

  /** The grid position map of the displayed areas. */
  positions: Map<string, [[number, number], [number, number]]>;

  /** The grid size of card. The first member is for columns and the second for rows. */
  size: [number, number];

  /** The array of displayed areas. */
  get displayedAreas(): string[] {
    if (!this.item || !this.areas || !this.positions) return [];
    return Array.from(this.positions.keys());
  }

  @HostBinding('class')
  /** The CSS class of the host element. */
  get hostClass(): string {
    return [
      SELECTOR,
      ...(
        !this.size ? [] :
        [`${SELECTOR}-columns-${this.size[0]}`, `${SELECTOR}-rows-${this.size[1]}`]
      )
    ].join(' ');
  }

  constructor(
    private _sanitizer: DomSanitizer
  ) { }

  /** The CSS class of the cells. */
  getCellClass(): string {
    return `${SELECTOR}-cell`;
  }

  /** The grid position */
  getCellPosition(key: string): SafeStyle {
    if (!this.positions.get(key)) return;
    const [[startRow, startCol], [endRow, endCol]] = this.positions.get(key);
    return this._sanitizer.bypassSecurityTrustStyle(
      `${startRow + 1} / ${startCol + 1} / ${endRow + 2} / ${endCol + 2}`
    );
  }

  ngOnChanges({card: cardChanges}: SimpleChanges) {
    if (cardChanges) {
      const previous: ItmCardConfig<I> = (
        cardChanges.isFirstChange ? {} : cardChanges.previousValue
      );
      if (previous === this.card) return;
      const {areas, size, positions}: ItmCardDef<I> = (
        this.card instanceof ItmCardDef ? this.card : new ItmCardDef(this.card)
      );
      if (!previous.areas || previous.areas !== areas) this.areas = areas;
      if (!previous.size || previous.size !== size) (this.size = size);
      if (this.positions !== positions) (this.positions =  positions);
    }
  }
}
