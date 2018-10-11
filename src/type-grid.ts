import Card from './card';
import Form from './form';
import { Itm } from './item';
import RecordFactory from './record-factory';

export module ItmTypeGrid {

  export type Config<I extends Itm = Itm> = Card.Config<I> & Form.Config<I>;

  export type Record<I extends Itm = Itm> = Card.Record<I> & Form.Record<I>;

  export const selector = 'typeGrid';

  export const factory: RecordFactory<Record, Config> = RecordFactory.build({
    selector,
    ancestors: [Card.factory, Form.factory]
  });
}

export default ItmTypeGrid;
