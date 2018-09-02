// tslint:disable-next-line:max-line-length
import { Directive, ElementRef, Renderer2, EventEmitter, Output, OnDestroy, ViewChild, AfterViewInit, Input, SimpleChanges, OnChanges, HostBinding, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription, fromEvent, merge, BehaviorSubject, Observable, Subject, empty } from 'rxjs';
import { tap, map, distinctUntilChanged } from 'rxjs/operators';
import { ItmDragActionService } from './drag.service';

export const DRAGGABLE_DROP_EFFECTS = ['move', 'copy', 'link'];


@Directive({selector: '[itmDroppable]', exportAs: 'itmDroppable'})
export class ItmDroppableDirective<T> implements OnDestroy {
  // tslint:disable-next-line:no-output-rename
  @Output('itmDroppable')
  /** The data target for the transfer. */
  drop = new EventEmitter<T>();

  get nativeElement(): HTMLElement { return this._nativeElement; }

  readonly dragoverChanges: Observable<boolean>;
  readonly dragoverEvent: Observable<DragEvent>;

  get dragover() {
    return this._dragover.value;
  }

  /** The host HTML element to drag. */
  private _nativeElement: HTMLElement;

  private _dragEventSubscr: Subscription;

  private _dragover = new BehaviorSubject(false);

  private _dragoverEvent = new Subject<DragEvent>();

  constructor(
    private _hostRef: ElementRef,
    private _renderer: Renderer2,
    private _service: ItmDragActionService
  ) {
    this._nativeElement = this._hostRef.nativeElement;
    this._subscribeDragEvents();
    this.dragoverChanges = this._dragover.pipe(distinctUntilChanged());
    this.dragoverEvent = this._dragoverEvent.asObservable();
  }

  ngOnDestroy() {
    if (this._dragEventSubscr) this._dragEventSubscr.unsubscribe();
  }

  private _subscribeDragEvents() {
    this._dragEventSubscr = this._dragEventSubscr = merge(
      fromEvent<DragEvent>(this._nativeElement, 'dragenter').pipe(
        map(e => {
          if (!this._service.isDragging) return true;
          if (!this.dragover) this._setDragover();
          e.preventDefault();
          return false;
        })
      ),
      fromEvent<DragEvent>(this._nativeElement, 'dragover').pipe(
        map(e => {
          if (!this._service.isDragging) return true;
          e.dataTransfer.dropEffect = this._service.pendingEffect;
          e.preventDefault();
          e.stopPropagation();
          if (this.dragover) this._dragoverEvent.next(e);
          return false;
        }),
      ),
      fromEvent<DragEvent>(this._nativeElement, 'dragleave').pipe(
        tap(e => {
          const newTarget = window.document.elementFromPoint(e.clientX, e.clientY);
          if (!this._nativeElement.contains(newTarget)) this._resetDragover();
          e.stopPropagation();
          return false;
        })
      ),
      fromEvent<DragEvent>(this._nativeElement, 'drop').pipe(
        tap(e => {
          e.preventDefault();
          e.dataTransfer.dropEffect = this._service.pendingEffect;
          e.stopPropagation();
          this._resetDragover();
          return false;
        })
      )
    )
    .subscribe();
  }

  private _setDragover() {
    if (this.dragover) return;
    this._dragover.next(true);
    this._renderer.addClass(this._nativeElement, 'itm-dragover');
  }

  private _resetDragover() {
    this._dragover.next(false);
    this._renderer.removeClass(this._nativeElement, 'itm-dragover');
  }
}
