import { Pipe, PipeTransform, Inject, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export const EXAMPLE_MARDOWN_CACHE = new InjectionToken('EXAMPLE_MARDOWN_CACHE');

@Pipe({
  name: 'exampleMarkdown'
})
export class ExampleMarkdownPipe implements PipeTransform {
  constructor(
    private readonly _http: HttpClient,
    @Inject(EXAMPLE_MARDOWN_CACHE)
    private readonly _cache: { [key: string]: string }
  ) { }

  transform(path: string): Observable<string> {
    if (this._cache[path]) return of(this._cache[path]);
    return this._http.get(`/example/${path}_example.component.ts`, {responseType: 'text'}).pipe(
      map(body => (this._cache[path] = '```typescript\n' + body + '\n```'))
    );
  }
}
