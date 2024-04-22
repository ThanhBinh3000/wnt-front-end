import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe as NgDatePipe } from '@angular/common';

@Pipe({
  name: 'appDate'
})
export class AppDatePipe extends NgDatePipe implements PipeTransform {

  override transform(input: any, format?: any, timezone?: any): any {
    input = this.convertDateFormat(input);
    if (!format) {
      format = "dd/MM/yyyy"
    }
    if (!timezone) {
      timezone = "UTC+7";
    }
    return super.transform(input, format, timezone);
  }

  convertDateFormat(input: any) {
    if (!input) return null;
    const parts = input.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
    if (!parts) throw new Error('Invalid date format');

    const day = parts[1];
    const month = parts[2];
    const year = parts[3];
    const hours = parts[4];
    const minutes = parts[5];
    const seconds = parts[6];

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

}
