import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to truncate text with ellipsis
 * Usage: {{ text | truncate:50 }}
 * Output: "This is a long text that will be..."
 */
@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit: number = 50, ellipsis: string = '...'): string {
    if (!value) {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }

    return value.substring(0, limit) + ellipsis;
  }
}
