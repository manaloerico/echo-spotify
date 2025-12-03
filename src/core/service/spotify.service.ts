import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  constructor(private http: HttpClient) {}
  setToken(token: string) {
    localStorage.setItem('spotify_token', token);
  }
  getTokenFromStorage(tokenName = ''): string | null {
    return localStorage.getItem(tokenName || 'spotify_token');
  }

  authorize() {}

  getToken() {
    const storedToken = this.getTokenFromStorage();
    if (storedToken) {
      return new Observable<string>((observer) => {
        observer.next(storedToken);
        observer.complete();
      });
    }

    return this.http
      .get<{
        access_token: string;
        expires_in: string;
        token_type: string;
      }>('/api/spotify')
      .pipe(
        tap((data) => {
          console.log('Fetched new token', data);
          this.setToken(data.access_token);
          this.setStorage('spotify_token_expiry', data.expires_in);
          this.setStorage('spotify_token_type', data.token_type);
        }),
        map((data) => data.access_token)
      );
  }
  setStorage(storageName: string, value: string) {
    localStorage.setItem(storageName, value);
  }
  getStorage(storageName: string): string | null {
    return localStorage.getItem(storageName);
  }
  searchTracks(query: string): Observable<any> {
    return this.http.get(`api/search?q=${encodeURIComponent(query)}`);
    // return this.http.get<any>('assets/mock/mock-search.json');
  }
  recommendation(songs: string[], playlistIds: string[]): Observable<any> {
    return this.http.post<any>('/api/recommendation', {
      songs,
    });
  }

  profile(): Observable<any> {
    return this.http.get<any>('https://api.spotify.com/v1/me');
  }
  following(type: string = 'artist'): Observable<any> {
    return this.http.get<any>(
      'https://api.spotify.com/v1/me/following?type=' + type
    );
  }
  playList(type: string = ''): Observable<any> {
    return this.http.get<any>('https://api.spotify.com/v1/me/playlists');
  }
}
