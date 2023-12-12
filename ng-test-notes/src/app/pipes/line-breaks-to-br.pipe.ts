import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineBreaksToBr'
})
export class LineBreaksToBrPipe implements PipeTransform {

	transform(value: string): string {
    if (!value) return value;
    return value.replace(/\n/g, '<br/>');
  }

}
