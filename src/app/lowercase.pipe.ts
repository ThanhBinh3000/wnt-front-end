import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lowercase',
  standalone: true
})
export class LowercasePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
