import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { SpotifyService } from 'src/core/service/spotify.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
  private readonly spotifyService = inject(SpotifyService);
  public playlist: any;

  ngOnInit(): void {
    combineLatest([this.spotifyService.getPlayList()]).subscribe(
      ([playlist]) => {
        this.playlist = playlist;
        console.log('User top tracks:', playlist);
      }
    );
  }
}
