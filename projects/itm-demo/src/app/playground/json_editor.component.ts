import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
  Input
} from '@angular/core';
import { EditorService, EditorModel } from './editor.service';
import { Subscription } from 'rxjs';

const GRID_CONTENT = (
`{
  "areas": [
    {
      "key": "id"
    }
  ],
  "template": [
    ["id"]
  ]
}
`
);

@Component({
  selector: 'itm-demo-json-editor',
  template: `
    <div *ngIf="loading">Loading…</div>
    <div #editor></div>
  `,
  styleUrls: ['editor.component.scss']
})
export class JsonEditorComponent<T extends Object = Object> implements AfterViewInit, OnDestroy {
  @Input()
  filename: string;

  @Output()
  change = new EventEmitter<EditorModel<T>>();

  @ViewChild('editor')
  editorRef: ElementRef;

  loading = false;

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
      this.filename,
      GRID_CONTENT
    ).subscribe(this.change);
  }
}
