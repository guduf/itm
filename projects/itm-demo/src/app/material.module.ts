import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconRegistry,
  MatIconModule,
  MatDialogModule,
  MatTooltipModule
} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const MODULES = [
  BrowserAnimationsModule,
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatTooltipModule
];

@NgModule({
  imports: MODULES,
  exports: MODULES,
})
/** The package of imported Material modules. */
export class MaterialModule {
  constructor(private _registry: MatIconRegistry, private _sanitizer: DomSanitizer) {
    this._registry.addSvgIcon(
      'github',
      this._sanitizer.bypassSecurityTrustResourceUrl('/assets/github.svg')
    );
  }
}
