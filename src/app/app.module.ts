import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SpotifyInterceptorService } from 'src/core/interceptor/spotify-interceptor.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: spotifyGetTokenInitializer,
    //   deps: [SpotifyService],
    //   multi: true,
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpotifyInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
