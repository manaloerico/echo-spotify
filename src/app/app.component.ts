import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs';
import { SpotifyService } from 'src/core/service/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet],
})
export class AppComponent implements OnInit {
  onSelect(_t8: any) {
    this.trackInp.push(_t8.name);
  }
  searchControl = new FormControl('');
  results: any[] = [];
  playlists: any;
  constructor(private spotifyService: SpotifyService) {}
  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((query) => this.spotifyService.searchTracks(query))
      )
      .subscribe((tracks: any[]) => {
        console.log(tracks);
        this.results = tracks;
      });
  }
  title = 'echo-spotify';
  trackInput = '';
  candidatePlaylists = [
    '37i9dQZF1DXcBWIGoYBM5M', // Example playlist IDs
    '37i9dQZF1DX0XUsuxWHRQd',
    '37i9dQZF1DX4JAvHpjipBk',
  ];
  trackInp: any = [];
  getRecommendations() {
    const trackIds = this.trackInput.split(',').map((t) => t.trim());
    this.spotifyService
      .recommendation(this.trackInp, this.candidatePlaylists)
      .subscribe((res) => (this.playlists = res));
  }

  loginWithSpotify() {
    window.location.href = 'http://localhost:3000/api/authorize';
  }
}
