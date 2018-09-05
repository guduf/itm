// tslint:disable-next-line:max-line-length
import { Directive, EmbeddedViewRef, Input, OnChanges, OnDestroy, Renderer2, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ItmDragActionService } from './drag.service';
import { ItmDroppableDirective } from './droppable.directive';

@Directive({selector: '[itmDropPlaceholderFor]'})
export class ItmDropPlaceholderDirective implements OnChanges, OnDestroy {
  // tslint:disable-next-line:no-input-rename
  @Input('itmDropPlaceholderFor')
  /** The reference on the droppable directive. */
  droppableRef: ItmDroppableDirective;

  /** The placeholder native element. */
  get nativeElement(): HTMLElement {
    if (!this._viewRef) return null;
    return this._viewRef.rootNodes[0];
  }

  /** The subscription on the dragover index. */
  private _dragoverIndexSubscr: Subscription;
  private _viewRef: EmbeddedViewRef<any>;

  constructor(
    private readonly _templateRef: TemplateRef<any>,
    private readonly _viewContainerRef: ViewContainerRef,
    private readonly _renderer: Renderer2,
    private readonly _service: ItmDragActionService
  ) { }

  ngOnChanges({droppableRef: {currentValue, previousValue}}: SimpleChanges) {
    if (!(currentValue instanceof ItmDroppableDirective)) {
      if (previousValue instanceof ItmDroppableDirective) previousValue.detachPlaceholder();
      this._resetView();
      return;
    }
    if (this._dragoverIndexSubscr) this._dragoverIndexSubscr.unsubscribe();
    this._dragoverIndexSubscr = this.droppableRef.attachPlaceholder(this).subscribe(
      i => this._onDragoverIndexChanges(i),
      err => console.error(err),
      () => this._resetView()
    );
  }

  ngOnDestroy() {
    if (this._dragoverIndexSubscr) this._dragoverIndexSubscr.unsubscribe();
    this.droppableRef.detachPlaceholder();
  }

  /** Create the embedded placeholder view. */
  private _createView(): EmbeddedViewRef<any> {
    const viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef);
    const placeholderEl = viewRef.rootNodes[0];
    if (!(placeholderEl instanceof HTMLElement)) return null;
    this._renderer.addClass(placeholderEl, 'itm-drop-placeholder');
    return viewRef;
  }

  /** Set the view and replace the placeholder when dragover changes. */
  private _onDragoverIndexChanges(i: number) {
    if (!(i >= 0)) return this._resetView();
    if (!this._viewRef) this._viewRef = this._createView();
    const droppableEl = this.droppableRef.nativeElement;
    const children = Array.from(droppableEl.children)
      .filter(el => (
        el !== this._service.pending.nativeEvent.target &&
        el !== this.nativeElement
      ));
    if (i >= children.length) droppableEl.appendChild(this.nativeElement);
    else droppableEl.insertBefore(this.nativeElement, children[i]);
  }

  /** Reset the the view container. */
  private _resetView(): void {
    this._viewContainerRef.clear();
    this._viewRef = null;
  }
}
