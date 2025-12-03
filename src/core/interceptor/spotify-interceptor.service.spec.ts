/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SpotifyInterceptorService } from './spotify-interceptor.service';

describe('Service: SpotifyInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpotifyInterceptorService]
    });
  });

  it('should ...', inject([SpotifyInterceptorService], (service: SpotifyInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
