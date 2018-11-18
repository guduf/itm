import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'exampleMarkdown'
})
export class ExampleMarkdownPipe implements PipeTransform {
  constructor(
    private readonly _http: HttpClient
  ) { }

  transform(path: string): Observable<string> {
    return this._http.get(`/example/${path}_example.component.ts`, {responseType: 'text'}).pipe(
      map(body => `\`\`\`typescript\n${body}\n\`\`\``)
    );
  }
}
