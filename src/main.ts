// platformBrowserDynamic().bootstrapModule(AppModule)

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { SpotifyInterceptorService } from './core/interceptor/spotify-interceptor.service';

//   .catch(err => console.error(err));
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpotifyInterceptorService,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
