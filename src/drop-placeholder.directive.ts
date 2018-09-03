// tslint:disable-next-line:max-line-length
import { Directive, OnChanges, OnDestroy, Input, TemplateRef, ViewContainerRef, SimpleChanges } from '@angular/core';
import { ItmDroppableDirective } from './droppable.directive';
import { Subscription } from 'rxjs';
import { map, distinctUntilChanged, filter, debounceTime, throttleTime } from 'rxjs/operators';

@Directive({selector: '[itmDropPlaceholderFor]'})
export class ItmDropPlaceholderDirective<T> implements OnChanges, OnDestroy {
  // tslint:disable-next-line:no-input-rename
  @Input('itmDropPlaceholderFor')
  droppableRef: ItmDroppableDirective;

  private _dragoverEventSubscr: Subscription;
  private _dragoverSubscr: Subscription;
  private _placeholderEl: HTMLElement;

  constructor(
    private readonly _templateRef: TemplateRef<any>,
    private readonly _viewContainerRef: ViewContainerRef
  ) { }

  ngOnChanges({droppableRef: {currentValue}}: SimpleChanges) {
    if (currentValue instanceof ItmDroppableDirective)
      this._attachDroppable();
  }

  ngOnDestroy() {
    if (this._dragoverEventSubscr) this._dragoverEventSubscr.unsubscribe();
    if (this._dragoverSubscr) this._dragoverSubscr.unsubscribe();
  }

  private _attachDroppable() {
    if (this._dragoverEventSubscr) this._dragoverEventSubscr.unsubscribe();
    if (this._dragoverSubscr) this._dragoverSubscr.unsubscribe();
    this._dragoverSubscr = this.droppableRef.dragoverChanges.pipe(
      map(dragover => {
        if (!dragover) return null;
        const viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef);
        const placeholderEl = viewRef.rootNodes[0];
        if (!(placeholderEl instanceof HTMLElement)) return null;
        const droppableEl = placeholderEl.parentElement;
        if (droppableEl !== this.droppableRef.nativeElement) {
          // tslint:disable-next-line:max-line-length
          console.error(new Error('The parent element of the placeholder is not the droppable element'));
          return null;
        }
        return placeholderEl;
      }),
      filter(placeholderEl => {
        this._placeholderEl = placeholderEl;
        if (!placeholderEl) this._viewContainerRef.clear();
        return Boolean(placeholderEl);
      })
    )
    .subscribe(
      dragoverEnabled => {
        if (dragoverEnabled) this._enableDragover();
        else this._dragoverEventSubscr.unsubscribe();
      },
      err => console.error(err)
    );
  }

  private _enableDragover() {
    if (this._dragoverEventSubscr) this._dragoverEventSubscr.unsubscribe();
    const droppableEl = this.droppableRef.nativeElement;
    const placeholderEl = this._placeholderEl;
    this._dragoverEventSubscr = this.droppableRef.dragoverEvent
      .pipe(
        map(e => {
          const i: number = Array.from(droppableEl.children).reduce(
            (acc, el, j) => (acc < 0 && el === e.target as HTMLElement) ? j : acc,
            -1
          );
          const child = (droppableEl.children.item(i) as HTMLElement) || placeholderEl;
          if (i < 0 || child === placeholderEl) return i;
          const rect = child.getBoundingClientRect();
          const isFirsHalf = e.clientY < rect.top + rect.height / 2;
          return isFirsHalf ? i : i + 1;
        }),
        distinctUntilChanged((a, b) => a === b)
      )
      .subscribe(
        i => {
          const child = droppableEl.children.item(i);
          if (child) droppableEl.insertBefore(placeholderEl, child);
        },
        err => console.error(err)
      );
  }
}
