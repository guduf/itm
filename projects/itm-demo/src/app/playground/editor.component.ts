import { AfterViewInit, OnDestroy, Component, ViewChild, ElementRef, NgZone } from '@angular/core';

// tslint:disable-next-line:max-line-length
declare function createJsonEditor(nativeElement: HTMLElement, filename: string, code?: string, onDidChangeContent?: (content: string) => void): () => void;

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

  private _dispose: () => void;

  constructor() { }

  ngAfterViewInit() {
    const content = (
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
    this._dispose = createJsonEditor(
      this.editorRef.nativeElement,
      'grid', content
    );
  }

  ngOnDestroy() { this._dispose(); }
}
