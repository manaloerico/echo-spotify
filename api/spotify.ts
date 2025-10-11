import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

let accessToken = '';
let tokenExpiry = 0;

async function getAccessToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) return accessToken;

  const creds = Buffer.from(
    `${process.env['SPOTIFY_CLIENT_ID']}:${process.env['SPOTIFY_CLIENT_SECRET']}`
  ).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  const { access_token, expires_in } = (await response.json()) as unknown as {
    access_token: string;
    expires_in: number;
  };
  accessToken = access_token;
  tokenExpiry = Date.now() + expires_in * 1000;
  return accessToken;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { trackIds } = req.query;
  const token = await getAccessToken();

  const result = await fetch(
    `https://api.spotify.com/v1/recommendations?seed_tracks=${trackIds}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await result.json();
  res.status(200).json(data);
}
