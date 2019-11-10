import { Pipe, PipeTransform } from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Pipe({
  name: 'localCurrency'
})
export class LocalCurrencyPipe implements PipeTransform {

  transform(value: any, code, locale: string = 'en'): any {
    return new CurrencyPipe(locale).transform(value, code, 'symbol', '1.0');
  }

}
