import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationInMinutes',
  standalone: true,
})
export class DurationInMinutesPipe implements PipeTransform {
  transform(ms: number): string {
    if (!ms && ms !== 0) return '';

    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // pad seconds (ex: "02")
    const paddedSeconds = seconds.toString().padStart(2, '0');

    return `${minutes}:${paddedSeconds}`;
  }
}
