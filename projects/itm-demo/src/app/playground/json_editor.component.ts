import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  Input
} from '@angular/core';
import { EditorService, EditorModel } from './editor.service';
import { Subscription } from 'rxjs';
import { SimpleChanges } from '@angular/core';

export interface JsonEditorModel {
  schema: 'grid' | 'target'  | 'targets';
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
// tslint:disable-next-line:max-line-length
export class JsonEditorComponent<T extends Object = Object> implements AfterViewInit, OnChanges, OnDestroy {
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
    if (this._service.loaded) return this._createEditor();
    const timeout = setTimeout(() => (this.loading = true));
    this._service.load().then(() => {
      clearTimeout(timeout);
      this.loading = false;
      this._createEditor();
    });
  }

  ngOnChanges({model: modelChanges}: SimpleChanges) {
    if (!modelChanges.isFirstChange) this._createEditor();
  }

  ngOnDestroy() {
    if (this._subscr) this._subscr.unsubscribe();
  }

  private _createEditor(): void {
    if (this._subscr) this._subscr.unsubscribe();
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
