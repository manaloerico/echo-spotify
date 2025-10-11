import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs';
import { SpotifyService } from 'src/core/service/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  searchControl = new FormControl('');
  results: any[] = [];
  constructor(private spotifyService: SpotifyService) {}
  ngOnInit(): void {
    this.spotifyService.getToken().subscribe((data) => {
      console.log(data);
    });

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

  onSearch(event: any) {
    const query = event.target.value;
    console.log('Search query:', query);
    // Implement search functionality here, e.g., call a search API
  }
}
