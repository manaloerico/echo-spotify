export const config = { runtime: 'edge' };

async function getAccessToken() {
  const res = await fetch(
    `${
      process.env['VERCEL_URL'] || 'https://echo-spotify.vercel.app'
    }/api/spotify`
  );
  const data = await res.json();
  return data.access_token;
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const titles = searchParams.get('titles'); // comma-separated song names
  if (!titles) {
    return new Response(JSON.stringify({ error: 'Missing song titles' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const token = await getAccessToken();
    const titleList = titles
      .split(',')
      .map((t) => t.trim())
      .slice(0, 5); // Spotify only allows up to 5 seeds
    const trackIds: string[] = [];

    for (const title of titleList) {
      const searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          title
        )}&type=track&limit=1`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const searchData = await searchRes.json();
      const track = searchData.tracks?.items?.[0];
      if (track) trackIds.push(track.id);
    }

    if (trackIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No matching songs found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const recRes = await fetch(
      `https://api.spotify.com/v1/recommendations?seed_tracks=${trackIds.join(
        ','
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await recRes.json();

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
