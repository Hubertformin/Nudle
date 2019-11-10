import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return value;
    }
    return moment(value).fromNow();
    // const time_index = raw_date.indexOf('at');
    // const formated_date = raw_date.slice(0, time_index);
    // return formated_date.join(' ');
  }

}
