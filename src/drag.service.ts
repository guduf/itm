import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ItmActionDef, ItmActionEvent } from './action';

export class ItmDragAction<T> extends ItmActionDef<T> {
  static readonly COPY_ACTION = new ItmDragAction('copy');
  static readonly LINK_ACTION = new ItmDragAction('link');
  static readonly MOVE_ACTION = new ItmDragAction('move');

  key: 'itm-drag-copy' | 'itm-drag-link' | 'itm-drag-move';

  private constructor(key: 'copy' | 'link' | 'move') {
    super({key: `itm-drag-${key}`, icon: 'drag_indicator'});
  }
}

export type ItmActionDragEvent<T> = ItmActionEvent<T, ItmDragAction<T>>;

@Injectable()
export class ItmDragActionService {
  get isDragging(): boolean { return Boolean(this._pending); }

  get pendingEffect(): 'copy' | 'link' | 'move' {
    switch (this._pending && this._pending.action) {
      case ItmDragAction.COPY_ACTION: return 'copy';
      case ItmDragAction.LINK_ACTION: return 'link';
      case ItmDragAction.MOVE_ACTION: return 'move';
      default: return null;
    }
  }

  get timestamp() { return this._pending.timestamp; }

  private _pending: {action: ItmDragAction<any>, target: any, timestamp: number};

  consumeDrag(e: DragEvent): ItmActionDragEvent<any> {
    const timestamp = parseFloat(e.dataTransfer.getData('Text'));
    if (timestamp !== this._pending.timestamp)
      throw new ReferenceError('Drag event data does\'nt match the pending timestamp');
    const actionEvent = new ItmActionEvent(this._pending.action, e, this._pending.target);
    this.resetDrag();
    return actionEvent;
  }

  startDrag<T>(action: ItmDragAction<T>, target: T, timestamp: number): void {
    if (!(action instanceof ItmDragAction))
      throw new TypeError('Action must be a instance of ItmDragAction');
    this._pending = {action, target, timestamp};
  }

  resetDrag(): void {
    this._pending = null;
  }
}
