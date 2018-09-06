import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, first } from 'rxjs/operators';

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

export class ItmDragActionEvent<T> extends ItmActionEvent<T, ItmDragAction<T>> {
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

  /** The pending action. */
  get pending(): ItmDragPendingAction { return this._pending; }

  /** see [[ItmDragService.pending]] */
  private _pending: ItmDragPendingAction;

  /** The subject of all drop action events. */
  private _dropEvent = new Subject<ItmDragActionEvent<any>>();

  /** Consume a native drop event and emits a new drag action event observing the pending action. */
  consumeDrag(e: DragEvent, newIndex: number, sameParent: boolean): ItmDragActionEvent<any> {
    const timestamp = parseFloat(e.dataTransfer.getData('Text'));
    if (timestamp !== this._pending.nativeEvent.timeStamp)
      throw new ReferenceError('Drag event data does\'nt match the pending timestamp');
    const actionEvent = new ItmDragActionEvent(
      this._pending.action,
      e,
      this._pending.target,
      this._pending.oldIndex,
      newIndex,
      sameParent
    );
    this.resetDrag();
    this._dropEvent.next(actionEvent);
    return actionEvent;
  }

  /** Start a pending action. */
  startDrag(pending: ItmDragPendingAction): Observable<ItmDragActionEvent<any>> {
    if (!(pending.action instanceof ItmDragAction))
      throw new TypeError('Action must be a instance of ItmDragAction');
    this._pending = pending;
    return this._dropEvent.pipe(
      filter(e => (
        parseFloat(e.nativeEvent.dataTransfer.getData('Text')) === pending.nativeEvent.timeStamp
      )),
      first()
    );
  }

  /** Reset a possible pending action. */
  resetDrag(): void {
    this._pending = null;
  }
}
