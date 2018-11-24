import { AfterViewInit, OnDestroy, Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { EditorService } from './editor.service';

const GRID_CONTENT = (
`{
  "areas": [
    {
      "key": ""
    }
  ],
  "template": [
    [""]
  ]
}
`
);

@Component({
  selector: 'itm-demo-editor',
  template: `
    <div *ngIf="loading">Loading…</div>
    <div #editor [ngStyle]="editorStyle"></div>
  `
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editor')
  editorRef: ElementRef;

  loading = false;

  get editorStyle() {
    return {display: 'block', width: '600px', height: '600px'};
  }

  private _dispose: () => void;

  constructor(
    private _service: EditorService
  ) { }

  ngAfterViewInit() {
    if (this._service.loaded) return this._create();
    const timeout = setTimeout(() => (this.loading = true));
    this._service.load().then(() => {
      clearTimeout(timeout);
      this.loading = false;
      this._create();
    });
  }

  ngOnDestroy() { this._dispose(); }

  private _create(): void {
    this._dispose = this._service.createJsonEditor(
      this.editorRef.nativeElement,
      'grid',
      GRID_CONTENT
    );
  }
}
