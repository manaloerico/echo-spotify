import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { SpotifyService } from 'src/core/service/spotify.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private readonly spotifyService = inject(SpotifyService);
  public profileData: any;
  public followData: any;
  public playListData: any;

  ngOnInit(): void {
    combineLatest([
      this.spotifyService.profile(),
      this.spotifyService.following(),
      this.spotifyService.playList(),
    ]).subscribe(([profile, following, playList]) => {
      console.log('User Profile:', profile);
      console.log('User Following:', following);
      console.log('User playList:', playList);
      this.profileData = profile;
      this.followData = following;
      this.playListData = playList;
    });
  }
}
