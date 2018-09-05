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

export class ItmActionDragEvent<T> extends ItmActionEvent<T, ItmDragAction<T>> {
  constructor(
    readonly action: ItmDragAction<T>,
    readonly nativeEvent: any,
    readonly target: T = {} as T,
    readonly oldIndex: number,
    readonly newIndex: number,
    readonly sameParent: boolean
  ) {
    super(action, nativeEvent, target);
  }
}

export interface ItmDragPendingAction {
  action: ItmDragAction<any>;
  target: any;
  oldIndex: number;
  nativeEvent: DragEvent;
  draggedNativeElement: HTMLElement;
}

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

  get pending(): ItmDragPendingAction { return this._pending; }

  private _pending: ItmDragPendingAction;

  consumeDrag(e: DragEvent, newIndex: number, sameParent: boolean): ItmActionDragEvent<any> {
    const timestamp = parseFloat(e.dataTransfer.getData('Text'));
    if (timestamp !== this._pending.nativeEvent.timeStamp)
      throw new ReferenceError('Drag event data does\'nt match the pending timestamp');
    const actionEvent = new ItmActionDragEvent(
      this._pending.action,
      e,
      this._pending.target,
      this._pending.oldIndex,
      newIndex,
      sameParent
    );
    this.resetDrag();
    return actionEvent;
  }

  startDrag<T>(pending: ItmDragPendingAction): void {
    if (!(pending.action instanceof ItmDragAction))
      throw new TypeError('Action must be a instance of ItmDragAction');
    this._pending = pending;
  }

  resetDrag(): void {
    this._pending = null;
  }
}
