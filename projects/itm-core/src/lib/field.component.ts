// import { Component, HostBinding } from '@angular/core';

// import { ItmAreaText } from './area';
// import { ItmFieldLabel } from './field';

// const SELECTOR = 'itm-field';

// /** Default component for field area if not specified in config. */
// @Component({
//   selector: SELECTOR,
//   template: `
//     <span class="${SELECTOR}-label">{{fieldLabel | async}}</span><br />
//     <span class="${SELECTOR}-text">{{areaText | async}}<span>
//   `
// })
// export class ItmFieldComponent {
//   @HostBinding('class')
//   /** The CSS class of the host element. */
//   get hostClass(): string { return SELECTOR; }

//   constructor(
//     readonly areaText: ItmAreaText,
//     readonly fieldLabel: ItmFieldLabel
//   ) { }
// }
