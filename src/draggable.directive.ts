import { Directive, Input, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { delay, map , tap} from 'rxjs/operators';

import { ItmDragAction, ItmDragActionService } from './drag.service';

export const DRAGGABLE_DROP_EFFECTS = ['move', 'copy', 'link'];

@Directive({ selector: '[itmDraggable]' })
export class ItmDraggableDirective<T> implements OnDestroy {
  // tslint:disable-next-line:no-input-rename
  @Input('itmDraggable')
  /** The data target for the transfer. */
  target: T;

  /** Whether the element is draggable */
  isDraggable = true;

  /** The host HTML element to drag. */
  private _nativeElement: HTMLElement;

  /** The subscriptions on native drag events. */
  private readonly _dragEventSubscr: Subscription;

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
          this._service.startDrag({
            action: ItmDragAction.MOVE_ACTION,
            target: this.target,
            nativeEvent: e,
            oldIndex,
            draggedNativeElement: this._nativeElement
          });
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
    this._dragEventSubscr.unsubscribe();
  }
}
