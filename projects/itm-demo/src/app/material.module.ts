import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconRegistry, MatIconModule } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

const MODULES = [
  MatButtonModule,
  MatIconModule
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
