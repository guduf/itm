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

export interface JsonEditorModel {
  schema: 'grid' | 'target';
  content: string | Object;
}

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
  model: JsonEditorModel;

  @Output()
  modelChange = new EventEmitter<EditorModel<T>>();

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
    const el = this.editorRef.nativeElement;
    const model = this.model || {} as JsonEditorModel;
    const schema = (this.model.schema || 'target') + '.json';
    const content = (
      !model.content ? '{}' :
      typeof model.content === 'string' ? model.content :
        JSON.stringify(model.content, null, 2)
    );
    this._subscr = (
      this._service.createJsonEditor(el, schema, content).subscribe(this.modelChange)
    );
  }
}
