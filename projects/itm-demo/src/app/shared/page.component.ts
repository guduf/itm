import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, distinctUntilChanged, tap, share } from 'rxjs/operators';

const SELECTOR = 'itm-demo-page';

@Component({
  selector: SELECTOR,
  templateUrl: 'page.component.html',
  styleUrls: ['page.component.scss']
})
export class PageComponent {
  readonly heading: string;

  sidenavMode = 'side';

  sidenavOpened = true;

  active: Observable<{ path: string, fragment: string }>;

  readonly routes: {
    path: string,
    text: string,
    link: any[],
    active: Observable<boolean>,
    hashRoutes: {
      fragment: string,
      text: string,
      active: Observable<boolean>,
    }[]
  }[];

  constructor(private _route: ActivatedRoute) {
    this.heading = 'page.' + this._route.parent.snapshot.url[0].path;
    const root = this._route.firstChild;
    const active = combineLatest(root.url, root.fragment).pipe(
      map(([[{path}], fragment]) => ({path, fragment})),
      share()
    );
    this.routes = this._route.routeConfig.children
      .filter(({path}) => path && path !== '**')
      .map(route => {
        const text = this.heading + '.' + route.path;
        const hashRoutes = (
          Array.isArray(route.data.hashRoutes) ?
            route.data.hashRoutes.map(hashRoute => ({
              fragment: hashRoute,
              text: text + '.' + hashRoute,
              active: active.pipe(
                map(({fragment}) => fragment === hashRoute),
                distinctUntilChanged()
              )
            })) :
            []
        );
        return  {
          link: ['..', route.path],
          path: route.path,
          text,
          active: active.pipe(map(({path}) => path === route.path), distinctUntilChanged()),
          hashRoutes
        };
      });
  }
}
