
import {
  FactorySansProvider,
  ValueSansProvider,
  StaticClassSansProvider
} from '@angular/core/src/di/provider';
import { Map, Record, RecordOf } from 'immutable';
import { Observable } from 'rxjs';

import RecordFactory from './record_factory';
import Target from './target';
import { ComponentType, AbstractRecord } from './utils';

/** Provide the area text. */
export abstract class ItmAreaText extends Observable<string> { }

/** Record that describes the properties of an generic area displayed in a grid. */
// tslint:disable-next-line:max-line-length
export abstract class ItmArea<T extends Object = {}> extends AbstractRecord<ItmArea.Model> implements RecordOf<ItmArea.Model> {
  readonly key: string;
  readonly comp: ComponentType | null;
  readonly text: Target.Pipe<T, string> | null;
  readonly size: RecordOf<ItmArea.Size>;
}

export module ItmArea {
  export interface Config<T = {}> {
    /** The identifier of the area. Must be unique in each selector context. */
    key: string;

    /** The text attached to the area. Can be injected by area components as ItmAreaText. */
    text?: Target.PipeLike<T, string> | false;

    /** The fraction of the available grid space occupied by the area. */
    size?: [number | [number, number], number | [number, number]] | Partial<Size>;

    /**
     * The component displayed in the area.
     * A default component could be determined the area factory and the config.
     */
    comp?: ComponentType | false;
  }

  export interface Size {
    width: number;
    flexWidth: number;
    height: number;
    flexHeight: number;
  }

  // tslint:disable-next-line:max-line-length
  export const sizeFactory = Record<Size>({width: null, flexWidth: null, height: null, flexHeight: null});

  export interface Model<T = {}> extends Config<T> {
    key: string;
    comp: ComponentType | null;
    text: Target.Pipe<T, string> | null;
    size: RecordOf<Size>;
  }

  export type Provider = ValueSansProvider | FactorySansProvider | StaticClassSansProvider;

  export type Providers = Map<any, Provider>;

  export const selector = 'area';
  export const defaultKey = '$default';
  export const keyPattern = `\\$?${RecordFactory.selectorPattern}`;
  export const keyRegExp = new RegExp(`^${keyPattern}$`);
}

export default ItmArea;
