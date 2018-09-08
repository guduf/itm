import { locales } from './locales';
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'itmLocale'})
export class ItmLocalePipe implements PipeTransform {
  transform(key: string): string {
    const fragments = key.split('.');
    if (fragments[0] === 'itm') {
      const locale =  locales[fragments.slice(1).join('.')] || '';
      if (!locale) console.error(new ReferenceError(`No locale with key: ${key}`));
      return locale;
    }
  }
}
