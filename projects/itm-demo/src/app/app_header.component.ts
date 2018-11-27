import { Component, HostBinding, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { map, distinctUntilChanged, startWith } from 'rxjs/operators';

@Component({
  selector: 'itm-demo-app-header',
  templateUrl: './app_header.component.html',
  styleUrls: ['./app_header.component.scss']
})
export class AppHeaderComponent implements OnDestroy {
  @HostBinding('class')
  get hostClass(): string { return this._hostClass; }

  private _hostClass = '';
  private _subscr: Subscription;

  constructor() {
    if (typeof window === 'undefined') return;
    this._subscr = fromEvent(window, 'scroll')
      .pipe(
        startWith(null),
        map(() => window.scrollY > 0),
        distinctUntilChanged()
      )
      .subscribe(
        fixed => (this._hostClass = fixed ? 'fixed' : ''),
        err => console.error(err)
      );
  }

  ngOnDestroy() { if (this._subscr) this._subscr.unsubscribe(); }
}
