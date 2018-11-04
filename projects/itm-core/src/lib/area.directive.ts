// import {
//   ComponentFactoryResolver,
//   Injector,
//   ViewContainerRef,
//   Input,
//   OnChanges,
//   Directive,
//   ElementRef,
//   Renderer2
// } from '@angular/core';
// import { Observable, isObservable, Subscription } from 'rxjs';
// import { map, startWith, pairwise } from 'rxjs/operators';

// import { ItmAreaText } from './area';
// import { ComponentType } from './utils';

// /** Directive used by ItmGridComponent to build grid area. */
// @Directive({selector: '[itmArea]'})
// // tslint:disable-next-line:max-line-length
// export class ItmAreaDirective implements OnChanges {
//   /**
//    * The reference that contains data needed to create the area component.
//    * The view container is cleaned at each changes and a new component is created.
//    */
//   // tslint:disable-next-line:no-input-rename
//   @Input('itmArea')
//   areaRef: { comp: ComponentType, injector: Injector };

//   private readonly _parentNode: string;
//   private _textNode: any;
//   private _textSubscr: Subscription;

//   constructor(
//     hostRef: ElementRef,
//     private readonly _componentFactoryResolver: ComponentFactoryResolver,
//     private readonly _viewContainerRef: ViewContainerRef,
//     private readonly _renderer: Renderer2
//   ) {
//     this._parentNode = this._renderer.parentNode(hostRef.nativeElement);
//   }

//   ngOnChanges() {
//     this._viewContainerRef.clear();
//     if (!this.areaRef || typeof this.areaRef !== 'object') return;
//     if (!this.areaRef.comp) try { return this._renderText(this.areaRef.injector.get(ItmAreaText)); }
//     catch (err) { console.error(err); return; }
//     this._textNode = null;
//     this._textSubscr = null;
//     const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
//       this.areaRef.comp
//     );
//     try { this._viewContainerRef.createComponent(componentFactory, null, this.areaRef.injector); }
//     catch (err) { console.error(err); }
//   }

//   private _resetText(): void {
//     if (this._textSubscr) this._textSubscr.unsubscribe();
//     if (this._textNode) {
//       this._renderer.removeChild(this._parentNode, this._textNode);
//       this._textNode = null;
//     }
//   }

//   private _renderText(areaText: Observable<string>): void {
//     this._resetText();
//     if (!isObservable(areaText)) return null;
//     this._textSubscr = areaText
//       .pipe(
//         map(text => (this._textNode = this._renderer.createText(text))),
//         startWith(null),
//         pairwise()
//       )
//       .subscribe(
//         ([prev, next]) => {
//           if (prev) this._renderer.removeChild(this._parentNode, prev);
//           this._renderer.appendChild(this._parentNode, next);
//         },
//         err => console.error(err)
//       );
//   }
// }

