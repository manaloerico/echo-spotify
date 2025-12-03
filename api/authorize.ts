export const config = {
  runtime: 'edge',
};

function generateRandomString(length: number) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export default async function handler(_: Request) {
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email user-follow-read';

  const client_id = process.env['SPOTIFY_CLIENT_ID']!;
  const redirect_uri =
    process.env['SPOTIFY_REDIRECT_URI'] || 'http://localhost:3000/api/callback';

  const params = new URLSearchParams({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri,
    state,
  });

  const url = `https://accounts.spotify.com/authorize?${params.toString()}`;

  return Response.redirect(url, 302);
}
