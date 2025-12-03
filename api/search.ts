export const config = { runtime: 'edge' };

async function getAccessToken() {
  // Use absolute URL to your Vercel function
  const res = await fetch('https://echo-spotify.vercel.app/api/spotify');
  const data = await res.json();
  return data.access_token;
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q');

  if (!q) {
    return new Response(JSON.stringify({ error: 'Missing search query' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const authHeader = req.headers.get('authorization');
    const result = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        q
      )}&type=track&limit=10`,
      {
        headers: { Authorization: authHeader },
      }
    );

    const data = await result.json();
    console.log('Spotify Search Results:', data);
    return new Response(JSON.stringify(data.tracks?.items), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
