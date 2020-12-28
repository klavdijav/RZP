import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sec2min'
})
export class Sec2minPipe implements PipeTransform {

  transform(value: number): string {

    if (value < 60) {
      return `00:${value.toFixed(0).padStart(2, '0')}`;
    } else {
      const min = Math.floor(value / 60);
      return `${min.toString().padStart(2, '0')}:${(value - (min * 60)).toFixed(0).padStart(2, '0')}`
    }
  }

}