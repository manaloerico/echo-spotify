import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { ButtonComponent } from 'src/app/ui/components/button/button.component';
import { DurationInMinutesPipe } from 'src/app/ui/pipes/duration-in-minutes.pipe';
import { SpotifyService } from 'src/core/service/spotify.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DurationInMinutesPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private readonly spotifyService = inject(SpotifyService);
  public profileData: any;
  public followData: any;
  public playListData: any;
  public topArtist: any;
  public topTracks: any;

  ngOnInit(): void {
    combineLatest([
      this.spotifyService.profile(),
      this.spotifyService.following(),
      this.spotifyService.playList(),
      this.spotifyService.getUserTopItems('artist', 5),
      this.spotifyService.getUserTopItems('tracks', 5),
    ]).subscribe(([profile, following, playList, topArtist, topTracks]) => {
      this.profileData = profile;
      this.followData = following;
      this.playListData = playList;
      this.topArtist = topArtist;
      this.topTracks = topTracks;

      console.log('User Profile:', profile);
      console.log('User Following:', following);
      console.log('User playList:', playList);
      console.log('User top artist:', topArtist);
      console.log('User top tracks:', topTracks);
    });
  }
}
