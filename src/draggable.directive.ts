// tslint:disable-next-line:max-line-length
import { Directive, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2, } from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { delay, map , tap} from 'rxjs/operators';

import { ItmDragAction, ItmDragActionService, ItmDragActionEvent } from './drag-action.service';

export const DRAGGABLE_DROP_EFFECTS = ['move', 'copy', 'link'];

@Directive({ selector: '[itmDraggable]' })
export class ItmDraggableDirective<T> implements OnDestroy {
  // tslint:disable-next-line:no-input-rename
  @Input('itmDraggable')
  /** The data target for the transfer. */
  target: T;

  @Output()
  /** Event emitter of drop action event targeting this target. */
  drop = new EventEmitter<ItmDragActionEvent<T>>();

  @Output()
  /** Event emitter of drop action event errors targeting this target. */
  dropError = new EventEmitter<ItmDragActionEvent<T>>();

  /** Whether the element is draggable */
  isDraggable = true;

  /** The host HTML element to drag. */
  private _nativeElement: HTMLElement;

  /** The subscriptions on native drag events. */
  private readonly _dragEventSubscr: Subscription;
  private _dragActionEventSubscr: Subscription;

  constructor(
    private _hostRef: ElementRef,
    private _renderer: Renderer2,
    private _service: ItmDragActionService
  ) {
    this._nativeElement = this._hostRef.nativeElement;
    this._renderer.setAttribute(this._nativeElement, 'draggable', 'true');
    this._dragEventSubscr = merge(
      fromEvent<DragEvent>(this._nativeElement, 'dragstart').pipe(
        map(e => {
          if (!this.isDraggable) return true;
          const oldIndex = Array.from(this._nativeElement.parentElement.children)
            .reduce((acc, el, i) => (acc >= 0 || this._nativeElement !== el) ? acc : i, -1);
          const dropEventObs = this._service.startDrag({
            action: ItmDragAction.MOVE_ACTION,
            target: this.target,
            nativeEvent: e,
            oldIndex,
            draggedNativeElement: this._nativeElement
          });
          if (this._dragActionEventSubscr) this._dragActionEventSubscr.unsubscribe();
          this._dragActionEventSubscr = dropEventObs.subscribe(
            dropEvent => this.drop.emit(dropEvent),
            err => this.dropError.emit(err)
          );
          e.dataTransfer.effectAllowed = this._service.pendingEffect;
          e.dataTransfer.setData('Text', String(e.timeStamp));
          this._renderer.addClass(this._nativeElement, 'itm-dragging');

          e.stopPropagation();
        }),
        delay(0),
        tap(() => {
          if (this._service.pendingEffect === 'move')
            this._renderer.addClass(this._nativeElement, 'itm-dragging-move');
        })
      ),
      fromEvent<DragEvent>(this._nativeElement, 'dragend').pipe(
        tap(e => {
          e.dataTransfer.dropEffect = this._service.pendingEffect;
          this._renderer.removeClass(this._nativeElement, 'itm-dragging');
          e.stopPropagation();
        }),
        delay(0),
        tap(() => this._renderer.removeClass(this._nativeElement, 'itm-dragging-move'))
      )
    )
    .subscribe();
  }

  ngOnDestroy() {
    if (this._dragEventSubscr) this._dragEventSubscr.unsubscribe();
    if (this._dragActionEventSubscr) this._dragActionEventSubscr.unsubscribe();
  }
}
