import { Component, OnChanges, Input } from '@angular/core';
import { ErrorObject } from 'ajv';

interface AjvErrorArticle {
  fragments: string[];
  message: string;
}

@Component({
  selector: 'itm-demo-ajv-errors',
  templateUrl: 'ajv_errors.component.html',
  styleUrls: ['ajv_errors.component.scss']
})
export class AjvErrorsComponent implements OnChanges {
  @Input()
  errors: ErrorObject[];

  get articles(): AjvErrorArticle[] { return this._articles; }

  private _articles: AjvErrorArticle[];

  ngOnChanges() {
    this._articles = (
      Array.isArray(this.errors) && this.errors.length ?
        this.errors.map(error => {
          const fragments = error ? error.dataPath.split('.').slice(1) : null;
          const message = (
            error ? error.message[0].toUpperCase() + error.message.slice(1) : null
          );
          return {fragments, message};
        }) :
        null
    );
  }
}
