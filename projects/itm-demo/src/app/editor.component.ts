import { AfterViewInit, OnDestroy, Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import * as monaco from 'monaco-editor';
import { MonacoService } from './monaco.service';

// tslint:disable-next-line:max-line-length
declare function createEditor(nativeElement: HTMLElement, options: monaco.editor.IEditorConstructionOptions): monaco.editor.IStandaloneCodeEditor;

@Component({
  selector: 'itm-demo-editor',
  template: '<div #editor [ngStyle]="editorStyle"></div>'
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editor')
  editorRef: ElementRef;

  get editorStyle() {
    return {display: 'block', width: '600px', height: '600px'};
  }

  private _editor: monaco.editor.IStandaloneCodeEditor;

  constructor(private _service: MonacoService) { }

  ngAfterViewInit() {
    // this._service.createJsonEditor(this.editorRef.nativeElement, 'area.json');
  }

  ngOnDestroy() {
    this._editor.dispose();
  }
}
