import { AfterViewInit, OnDestroy, Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { EditorService } from './editor.service';
import { Subscription } from 'rxjs';

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

  private _subscr: Subscription;

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

  ngOnDestroy() { if (this._subscr) this._subscr.unsubscribe(); }

  private _create(): void {
    this._subscr = this._service.createJsonEditor(
      this.editorRef.nativeElement,
      'grid.json',
      GRID_CONTENT
    ).subscribe(
      e => console.log(e),
      err => console.log(err)
    );
  }
}
