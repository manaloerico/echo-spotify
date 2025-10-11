export const config = { runtime: 'edge' };
import { VercelRequest, VercelResponse } from '@vercel/node';

async function getAccessToken() {
  const res = await fetch(
    `${
      process.env['VERCEL_URL'] || 'https://echo-spotify.vercel.app'
    }/api/spotify`
  );
  const data = await res.json();
  return data.access_token;
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const q = req.query['q'] as string;
  if (!q) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  const token = await getAccessToken();

  const result = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      q
    )}&type=track&limit=5`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await result.json();
  return res.status(200).json(data.tracks.items);
}
