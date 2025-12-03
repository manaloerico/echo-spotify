import { firstValueFrom } from 'rxjs';
import { SpotifyService } from '../service/spotify.service';

export function spotifyGetTokenInitializer(spotifyService: SpotifyService) {
  return () => firstValueFrom(spotifyService.getToken());
}
