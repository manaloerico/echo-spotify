import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { DurationInMinutesPipe } from 'src/app/ui/pipes/duration-in-minutes.pipe';
import { SpotifyService } from 'src/core/service/spotify.service';

@Component({
  selector: 'app-recently-played',
  standalone: true,
  imports: [CommonModule, DurationInMinutesPipe],
  templateUrl: './recently-played.component.html',
  styleUrls: ['./recently-played.component.scss'],
})
export class RecentlyPlayedComponent {
  private readonly spotifyService = inject(SpotifyService);
  public recentlyPlayed: any;

  ngOnInit(): void {
    combineLatest([this.spotifyService.getRecentlyPlayed()]).subscribe(
      ([recentlyPlayed]) => {
        this.recentlyPlayed = recentlyPlayed;
        console.log('User top tracks:', recentlyPlayed);
      }
    );
  }
}
