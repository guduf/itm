import { Component, OnInit, ElementRef } from '@angular/core';
import { Range } from 'immutable';

const PATTERN_SIZE = 800;
const PATTERN_HEIGHT = 600;

@Component({
  selector: 'itm-demo-background',
  templateUrl: 'background.component.html',
  styleUrls: ['background.component.scss']
})
export class BackgroundComponent implements OnInit {
  size: number[] = [0];

  constructor(private _hostRef: ElementRef) { }

  ngOnInit() {
    if (typeof window === 'undefined') return;
    const {width, height} = (this._hostRef.nativeElement as HTMLElement).getBoundingClientRect();
    console.log({
      width,
      height,
      size: Math.ceil(width / PATTERN_SIZE),
      rows: Math.ceil(height / PATTERN_HEIGHT)
    });
    this.size = Range(0, 6).toArray();
  }
}
