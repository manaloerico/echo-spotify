import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  constructor(private http: HttpClient) {}

  getToken() {
    return this.http.get<{ access_token: string }>('/api/spotify');
  }
  searchTracks(query: string): Observable<any> {
    return this.http.get(`api/search?q=${encodeURIComponent(query)}`);
  }
}
