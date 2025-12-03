import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpotifyService } from '../service/spotify.service';

@Injectable({
  providedIn: 'root',
})
export class SpotifyInterceptorService {
  constructor(private spotify: SpotifyService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.spotify.getTokenFromStorage('access_token');
    if (token) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next.handle(authReq);
    }
    // If token missing, just forward request
    return next.handle(req);
  }

  //   intercept(
  //     req: HttpRequest<any>,
  //     next: HttpHandler
  //   ): Observable<HttpEvent<any>> {
  //     // Only attach token for Spotify API requests
  //     if (!req.url.startsWith('/api/spotify')) {
  //       return this.spotify.getToken().pipe(
  //         take(1),
  //         switchMap((token) => {
  //           if (token) {
  //             const authReq = req.clone({
  //               setHeaders: { Authorization: `Bearer ${token}` },
  //             });
  //             return next.handle(authReq);
  //           }
  //           // If token missing, just forward request
  //           return next.handle(req);
  //         })
  //       );
  //     }

  //     // For non-Spotify requests
  //     return next.handle(req);
  //}
}
