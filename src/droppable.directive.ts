// tslint:disable-next-line:max-line-length
import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, Output, Renderer2 } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription, throwError } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

import { ItmDragActionEvent, ItmDragActionService } from './drag-action.service';
import { ItmDropPlaceholderDirective } from './drop-placeholder.directive';

export const DRAGGABLE_DROP_EFFECTS = ['move', 'copy', 'link'];

@Directive({selector: '[itmDroppable]', exportAs: 'itmDroppable'})
export class ItmDroppableDirective implements OnDestroy {
  // tslint:disable-next-line:no-output-rename
  @Output('itmDroppable')
  /** The data target for the transfer. */
  drop = new EventEmitter<ItmDragActionEvent<any>>();

  /** The droppable native element. */
  get nativeElement(): HTMLElement { return this._nativeElement; }

  /** Whether dragover is on */
  get dragover(): boolean {
    return this._dragoverIndex.value >= 0;
  }

  /** The host HTML element to drag. */
  private _nativeElement: HTMLElement;

  /** The subscriptions on native drag events. */
  private _dragEventSubscr: Subscription;

  /** The behavior subject of dragover index. */
  private _dragoverIndex = new BehaviorSubject(-1);

  /** The reference of the placeholder attached to droppable. */
  private _placeholder: ItmDropPlaceholderDirective;

  constructor(
    private _hostRef: ElementRef,
    private _renderer: Renderer2,
    private _service: ItmDragActionService,
    private _zone: NgZone
  ) {
    this._nativeElement = this._hostRef.nativeElement;
    this._subscribeDragEvents();
  }

  ngOnDestroy() {
    if (this._dragEventSubscr) this._dragEventSubscr.unsubscribe();
  }

  /** Attach a placeholder which listen dragover index changes. */
  attachPlaceholder(placeholder: ItmDropPlaceholderDirective): Observable<number> {
    if (this.dragover) return throwError(new Error('Can\'t attach a placeholder when dragover'));
    this._placeholder = placeholder;
    return this._dragoverIndex.pipe(takeWhile(() => this._placeholder === placeholder));
  }

  /** Detach a placeholder. */
  detachPlaceholder() {
    if (this.dragover) {
      console.error(new Error('Can\'t detach a placeholder when dragover'));
      return this._resetDragover();
    }
    this._placeholder = null;
    this._dragoverIndex.next(-1);
  }

  /** Subscribe on native drag events. */
  private _subscribeDragEvents() {
    this._dragEventSubscr = this._dragEventSubscr = this._zone.runOutsideAngular(() => {
      return merge(
        fromEvent<DragEvent>(this._nativeElement, 'dragenter').pipe(
          map(e => {
            if (!this._service.isDragging) return true;
            if (!this.dragover) this._setDragover();
            e.preventDefault();
            return false;
          })
        ),
        fromEvent(this.nativeElement, 'dragover').pipe(
          map((e: DragEvent) => {
            e.preventDefault();
            this._refreshDragoverIndex(e);
            return false;
          })
        ),
        fromEvent<DragEvent>(this._nativeElement, 'dragleave').pipe(
          map(e => {
            const newTarget = window.document.elementFromPoint(e.clientX, e.clientY);
            if (!this._nativeElement.contains(newTarget)) this._resetDragover();
            e.stopPropagation();
            return false;
          })
        ),
        fromEvent<DragEvent>(this._nativeElement, 'drop').pipe(
          map(e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = this._service.pendingEffect;
            let actionEvent: ItmDragActionEvent<any>;
            if (!(this._dragoverIndex.value >= 0)) return this._resetDragover();
            const sameParent = (
              this._service.pending.draggedNativeElement.parentElement === this.nativeElement
            );
            try {
              actionEvent = this._service.consumeDrag(e, this._dragoverIndex.value, sameParent);
            }
            catch (err) { console.error(err); }
            this.drop.emit(actionEvent);
            e.stopPropagation();
            this._resetDragover();
            return false;
          })
        )
      )
      .subscribe();
    });
  }

  /** Set the dragover event listenner. */
  private _setDragover() {
    this._renderer.addClass(this._nativeElement, 'itm-dragover');
  }

  /** Resets the dragover state. */
  private _resetDragover(): false {
    this._renderer.removeClass(this._nativeElement, 'itm-dragover');
    this._dragoverIndex.next(-1);
    return false;
  }

  /** Refresh the dragover index observing event and children positions.  */
  private _refreshDragoverIndex(e: DragEvent): number {
    const placeholderEl: HTMLElement = this._placeholder && this._placeholder.nativeElement || null;
    if (placeholderEl && placeholderEl.contains(e.target as HTMLElement)) return;
    const children = Array.from(this.nativeElement.children)
      .filter(el => (
        el !== this._service.pending.nativeEvent.target &&
        el !== placeholderEl
      ));
    let dragoverIndex = children.length;
    for (let i = 0; i < children.length; i++)
      if (children[i].contains(e.target as HTMLElement)) {
        const rect = children[i].getBoundingClientRect();
        dragoverIndex = i += (e.clientY < rect.top + rect.height / 2) ? 0 : 1;
        break;
      }
    if (this._dragoverIndex.value !== dragoverIndex) this._dragoverIndex.next(dragoverIndex);
    return this._dragoverIndex.value;
  }
}
