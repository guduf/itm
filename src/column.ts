import { Observable } from 'rxjs';

import { Itms, Itm } from './itm';
import { CmpClass, isConstructor, ItmColumnData } from './utils';

/** Data for the injected ItmColumn for ItmDefaultCellComponent. */
export interface ItmDefaultColumnData<I extends Itm = Itm> {
  setValueChanges: ((item: I) => (string | Observable<string>));
}

/** Data for the injected ItmColumn for ItmDefaultHeaderCellComponent. */
export interface ItmDefaultHeaderColumnData<I extends Itm = Itm> extends ItmColumnData {
  setHeadingChanges: ((items: Itms<I>) => (string | Observable<string>));
}

/** The definition of a column used by ItmTable. */
export interface ItmColumnDef<D extends ItmColumnData = ItmColumnData> {
  /** Used by MatTable but also as default value for the attr and the header. */
  key: string;
  /** Used by MatTable. */
  sortable?: true;
  /** The display width of column based on a base 12. */
  size?: number;
  /** The flex behavior of the column. */
  grow?: number;
  /**
   * The component displayed in MatCell.
   * In case of component class, the value is used by the component factory.
   * In case of string, the value is used as the attribute for default cell. */
  cell?: (
    string |
    CmpClass |
    ((item: Itm) => (string | Observable<string>))
  );
  /**
   * The component displayed in MatHeaderCell.
   * In case of component class, the value is used by the component factory.
   * In case of string, the value is used as the attribute for default header cell.
   * In case of false, none header is displayed. */
  header?: (
    string |
    CmpClass |
    ((items: Itms) => (string | Observable<string>)) |
    false
  );
  /** The plain object to access custom data in cell components. */
  data?: D;
}

export class ItmColumn<D extends ItmColumnData = ItmColumnData> implements ItmColumnDef<D> {
  key: string;
  sortable?: true;
  size: number;
  grow: number;
  cell: CmpClass;
  header: CmpClass;
  data: D;

  constructor(def: ItmColumnDef) {
    if (typeof def === 'string') def = {key: def};
    if (!def.key) throw new TypeError('Missing key on ItmColumn');
    this.key = def.key;
    if (def.sortable) this.sortable = true;
    this.size = def.size || 1;
    this.grow = def.grow || 0;
    this.cell = isConstructor(def.cell) ? def.cell : null;
    if (!this.cell) {
      const setValueChanges: (item: Itm) => (string | Observable<string>) = (
        def.cell === false ? null :
        typeof def.cell === 'function' ? def.cell :
        typeof def.cell === 'string' ? itm => itm[def.cell] :
          itm => itm[this.key]
      );
      // WORKAROUND remove any type
      (this.data as any) = {...(this.data as any), setValueChanges} as ItmDefaultColumnData;
    }
    this.header = isConstructor(def.header) ? def.header : null;
    if (!this.header) {
      const setHeadingChanges: (items: Itms) => (string | Observable<string>) = (
        def.header === false ? null :
        typeof def.header === 'function' ? def.header :
        typeof def.header === 'string' ? () => def.header :
          () => this.key
      );
      // WORKAROUND remove any type
      (this.data as any) = {...(this.data as any), setHeadingChanges} as ItmDefaultHeaderColumnData;
    }
  }
}
