import { Map, RecordOf } from 'immutable';

import Grid from './grid';
import Form from './form';
import Prop from './prop';
import Table from './table';

export type ItmType<I extends Object = {}> = RecordOf<ItmType.Model<I>>;

export module ItmType {
  export interface Config<I extends Object = {}> {
    target?: any;
    props?: Map<string, Prop>;
    key?: string;
    grid?: Grid.Config<I>;
    form?: Grid.Config<I>;
    table?: Grid.Config<I>;
  }

  export interface Model<I extends Object = {}> extends Config<I> {
    key: string;
    grid: Grid;
    form: Form;
    table: Table;
    target: any;
    props: Map<string, Prop>;
  }

  export const selector = 'type';
}

export default ItmType;
