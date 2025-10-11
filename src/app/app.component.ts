import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/core/service/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private spotifyService: SpotifyService) {}
  ngOnInit(): void {
    this.spotifyService.getToken().subscribe((data) => {
      console.log(data);
    });
  }
  title = 'echo-spotify';
}
