export const config = {
  runtime: 'edge',
};

let accessToken = '';
let tokenExpiry = 0;

async function getAccessToken() {
  const now = Date.now();
  //if (accessToken && now < tokenExpiry) return accessToken;

  const clientId = process.env['SPOTIFY_CLIENT_ID']!;
  const clientSecret = process.env['SPOTIFY_CLIENT_SECRET']!;
  const creds = btoa(`${clientId}:${clientSecret}`);
  console.log('Spotify creds:', creds, clientId, clientSecret);
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    console.error('Failed to fetch Spotify token', await response.text());
    throw new Error('Failed to get Spotify token');
  }

  const { access_token, expires_in } = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  accessToken = access_token;
  tokenExpiry = now + expires_in * 1000;
  return accessToken;
}
export default async function handler() {
  try {
    const token = await getAccessToken();
    return new Response(
      JSON.stringify({
        access_token: token,
        expires_in: Math.floor((tokenExpiry - Date.now()) / 1000),
        token_type: 'Bearer',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
// export default async function handler(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const trackIds = searchParams.get('trackIds');

//   if (!trackIds) {
//     return new Response(
//       JSON.stringify({ error: 'Missing trackIds parameter' }),
//       { status: 400, headers: { 'Content-Type': 'application/json' } }
//     );
//   }

//   try {
//     const token = await getAccessToken();

//     const result = await fetch(
//       `https://api.spotify.com/v1/recommendations?seed_tracks=${trackIds}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     const data = await result.json();
//     return new Response(JSON.stringify(data), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (err: any) {
//     return new Response(
//       JSON.stringify({ error: err.message || 'Internal Server Error' }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }
