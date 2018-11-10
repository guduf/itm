import { AfterViewInit, Component, ViewChild, ElementRef, NgZone } from '@angular/core';

@Component({
  selector: 'itm-demo-yaml-editor',
  template: '<div #editor></div>'
})

export class YamlEditorComponent implements AfterViewInit {
  @ViewChild('editor')
  editorRef: ElementRef;

  private _buildPrismDraft: any;

  constructor(private _zone: NgZone) {
    this._buildPrismDraft = (window as any)['buildPrismDraft'];
  }

  ngAfterViewInit() {
    this._zone.runOutsideAngular(() => {
      this._buildPrismDraft(this.editorRef.nativeElement, e => {
        console.log(e);
        return e;
      });
    });
  }
}
