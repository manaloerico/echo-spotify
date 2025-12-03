export const config = { runtime: 'edge' };

type AudioFeatures = {
  danceability: number;
  energy: number;
  valence: number;
  tempo: number;
  acousticness: number;
};

// Helper: Fetch track audio features
async function getTrackFeatures(
  trackId: string,
  authHeaders: string
): Promise<AudioFeatures> {
  console.log(authHeaders);
  const res = await fetch(
    `https://api.spotify.com/v1/audio-features/11dFghVXANMlKmJXsNCbNl`,
    {
      headers: {
        Authorization: `Bearer BQABLAvMVWJ7NOrcXYOgHCdQOBBgPXxuEDgTxw-rCtWjIJtJ7Ift6rjwSmy-xbl6ooMMekl9A6lPT5S-Y4Hmf50kpAbFY9qj-aBab9FTZE4F0XUOgpwf3o0bja2-MygI_4FfH9Jujew`,
      },
    }
  );
  if (!res.ok) {
    console.error('Spotify API error:', await res.text());
    return null;
  }

  const data = await res.json();
  console.log('getTrackFeatures', data);
  return data as AudioFeatures;
}

// Helper: Fetch playlist average features
async function getPlaylistFeatures(
  playlistId: string,
  authHeaders: string
): Promise<AudioFeatures> {
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: authHeaders,
      },
    }
  );
  const data = (await res.json()) as unknown as { items: any[] };
  console.log('Playlist tracks:', data.items.length);
  const trackFeatures = await Promise.all(
    data.items.map((item: any) => getTrackFeatures(item.track.id, authHeaders))
  );

  const keys: (keyof AudioFeatures)[] = [
    'danceability',
    'energy',
    'valence',
    'tempo',
    'acousticness',
  ];

  const avg: AudioFeatures = {
    danceability: 0,
    energy: 0,
    valence: 0,
    tempo: 0,
    acousticness: 0,
  };

  keys.forEach((k) => {
    avg[k] =
      trackFeatures.reduce((sum: any, f: any) => sum + (f[k] || 0), 0) /
      trackFeatures.length;
  });

  return avg;
}

// Simple Euclidean distance
function distance(a: AudioFeatures, b: AudioFeatures): number {
  return Math.sqrt(
    (a.danceability - b.danceability) ** 2 +
      (a.energy - b.energy) ** 2 +
      (a.valence - b.valence) ** 2 +
      (a.tempo - b.tempo) ** 2 +
      (a.acousticness - b.acousticness) ** 2
  );
}

// export default async function handler(req: Request, res: Response) {
//   if (req.method !== 'POST') {
//     return new Response(JSON.stringify({ error: 'Method not allowed' }), {
//       status: 405,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   try {
//     const body = await req.json();
//     const { trackIds, playlistIds } = body as unknown as {
//       trackIds: string[];
//       playlistIds: string[];
//     };

//     if (!trackIds?.length || !playlistIds?.length) {
//       return new Response(
//         JSON.stringify({ error: 'trackIds and playlistIds are required.' }),
//         {
//           status: 400,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     }

//     const authHeader = req.headers.get('authorization');

//     console.log('tids', trackIds, trackIds.length);
//     // Compute user profile
//     const userFeatures = await Promise.all(
//       trackIds.map((id) => getTrackFeatures(id, authHeader))
//     );
//     console.log('userFeatures', userFeatures);

//     const userProfile: AudioFeatures = {
//       danceability:
//         userFeatures.reduce((sum, f) => sum + (f.danceability || 0), 0) /
//         userFeatures.length,
//       energy:
//         userFeatures.reduce((sum, f) => sum + (f.energy || 0), 0) /
//         userFeatures.length,
//       valence:
//         userFeatures.reduce((sum, f) => sum + (f.valence || 0), 0) /
//         userFeatures.length,
//       tempo:
//         userFeatures.reduce((sum, f) => sum + (f.tempo || 0), 0) /
//         userFeatures.length,
//       acousticness:
//         userFeatures.reduce((sum, f) => sum + (f.acousticness || 0), 0) /
//         userFeatures.length,
//     };

//     // Score playlists
//     const scores = [];
//     for (const pid of playlistIds) {
//       const playlistProfile = await getPlaylistFeatures(pid, authHeader);
//       const sim = 1 / (1 + distance(userProfile, playlistProfile));
//       scores.push({ playlistId: pid, score: sim });
//     }

//     scores.sort((a, b) => b.score - a.score);

//     return new Response(JSON.stringify(scores.slice(0, 5)), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (err: any) {
//     console.error('Error:', err);

//     return new Response(
//       JSON.stringify({ error: 'Internal Server Error', details: err.message }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
// }
export default async function handler(req: Request) {
  const { trackIds } = await req.json();

  if (!trackIds || !Array.isArray(trackIds)) {
    return new Response(
      JSON.stringify({ error: 'trackIds must be an array' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const token = await getAccessToken();
    const recommendations = await getRecommendedTracks(trackIds, token);

    return new Response(JSON.stringify(recommendations), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function getAccessToken() {
  const res = await fetch('https://echo-spotify.vercel.app/api/spotify');
  const data = await res.json();
  return data.access_token;
}

async function getRecommendedTracks(trackIds: string[], token: string) {
  if (!trackIds.length) throw new Error('No track IDs provided');

  const headers = { Authorization: `Bearer ${token}` };
  const baseTrackId = trackIds[0];

  console.log('Getting recommendations for base track:', baseTrackId);

  // 1️⃣ Base track
  const trackRes = await fetch(
    `https://api.spotify.com/v1/tracks/${baseTrackId}`,
    { headers }
  );
  if (!trackRes.ok) {
    console.error(
      'Failed to fetch track:',
      trackRes.status,
      trackRes.statusText
    );
    throw new Error('Spotify track fetch failed');
  }
  const trackData = await trackRes.json();
  const artistId = trackData.artists?.[0]?.id;
  if (!artistId) throw new Error('No artist found for seed track');

  console.log(
    'Artist ID:',
    artistId,
    'Artist name:',
    trackData.artists?.[0]?.name
  );

  // 2️⃣ Related artists
  const relatedUrl = `https://api.spotify.com/v1/artists/${artistId}/related-artists`;
  console.log('Calling related-artists endpoint:', relatedUrl);
  const token2 = await getAccessToken();

  const headers2 = { Authorization: `Bearer ${token2}` };
  const relatedRes = await fetch(relatedUrl, { headers: headers2 });
  if (!relatedRes.ok) {
    console.error(
      'Failed to fetch related artists:',
      relatedRes.status,
      relatedRes.statusText
    );
    throw new Error(
      `Spotify related artists fetch failed (${relatedRes.status})`
    );
  }

  const relatedData = await relatedRes.json();

  // 3️⃣ Top tracks
  const recommendations: any[] = [];
  for (const artist of relatedData.artists.slice(0, 3)) {
    const topRes = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
      { headers }
    );
    if (!topRes.ok) {
      console.warn(
        'Failed to fetch top tracks for',
        artist.name,
        topRes.status
      );
      continue;
    }
    const topData = await topRes.json();
    recommendations.push(...topData.tracks);
  }

  return { tracks: recommendations.slice(0, 10) };
}
