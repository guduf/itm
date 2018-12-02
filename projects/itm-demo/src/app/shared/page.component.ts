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
  readonly heading: Observable<string>;

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
    const root = this._route.firstChild;
    const active = combineLatest(root.url, root.fragment).pipe(
      map(([[{path}], fragment]) => ({path, fragment})),
      share()
    );
    this.routes = this._route.routeConfig.children
      .filter(({path}) => path && path !== '**')
      .map(route => {
        const text = 'page' + '.route.' + route.path;
        const hashRoutes = (
          Array.isArray(route.data.hashRoutes) ?
            route.data.hashRoutes.map(hashRoute => ({
              fragment: hashRoute,
              text: text + '.hash.' + hashRoute,
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
    this.heading = this._route.data.pipe(map(data => data.heading));
  }
}
