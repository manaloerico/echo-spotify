import { Routes } from '@angular/router';
import { ProfileComponent } from 'src/app/features/profile/profile.component';
import { RecentlyPlayedComponent } from 'src/app/features/recently-played/recently-played.component';
import { AuthenticatedComponent } from './authenticated.component';

export const authenticatedRoutes: Routes = [
  {
    path: '',
    component: AuthenticatedComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },

      { path: 'recently-played', component: RecentlyPlayedComponent },
      //{ path: 'stats', component: StatsComponent },
      //   { path: 'recently-played', component: RecentlyPlayedComponent },
      //   { path: 'playlists', component: PlaylistsComponent },
      //   { path: 'library', component: LibraryComponent },
      //   { path: 'search', component: SearchComponent },
      //   { path: 'insights', component: InsightsComponent },
    ],
  },
];
