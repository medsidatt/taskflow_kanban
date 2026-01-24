import { Pipe, PipeTransform } from '@angular/core';
import { DateUtils } from '../utils/date.utils';

/**
 * Pipe to display relative time
 * Usage: {{ date | relativeTime }}
 * Output: "2 hours ago", "just now", etc.
 */
@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date | string | null | undefined): string {
    if (!value) {
      return '';
    }
    return DateUtils.getRelativeTime(value);
  }
}
