import { AfterViewInit, Component, HostBinding, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'itm-demo-app-header',
  templateUrl: './app_header.component.html',
  styleUrls: ['./app_header.component.scss']
})
export class AppHeaderComponent implements AfterViewInit, OnDestroy {
  @HostBinding('class')
  get hostClass(): string { return this._scrolled ? 'fixed' : ''; }

  private _scrolled: boolean;
  private _subscr: Subscription;

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    this._subscr = fromEvent(window, 'scroll')
      .pipe(map(() => window.scrollY > 0), distinctUntilChanged())
      .subscribe(scrolled => (this._scrolled = scrolled), err => console.error(err));
  }

  ngOnDestroy() {
    if (this._subscr) this._subscr.unsubscribe();
  }
}
