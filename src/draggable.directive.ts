import { Directive, Input, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { tap, delay, map } from 'rxjs/operators';
import { ItmDragActionService, ItmDragAction } from './drag.service';

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

  private readonly _subscr: Subscription;

  constructor(
    private _hostRef: ElementRef,
    private _renderer: Renderer2,
    private _service: ItmDragActionService
  ) {
    this._nativeElement = this._hostRef.nativeElement;
    this._renderer.setAttribute(this._nativeElement, 'draggable', 'true');
    this._subscr = merge(
      fromEvent<DragEvent>(this._nativeElement, 'dragstart').pipe(
        map(e => {
          if (!this.isDraggable) return true;
          this._service.startDrag(ItmDragAction.MOVE_ACTION, {}, e.timeStamp);
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
          e.dataTransfer.dropEffect = DRAGGABLE_DROP_EFFECTS[0];
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
    this._subscr.unsubscribe();
  }
}
