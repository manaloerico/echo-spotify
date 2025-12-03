export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code') as string | undefined;
  const state = url.searchParams.get('state') as string | undefined;

  const client_id = process.env['SPOTIFY_CLIENT_ID']!;
  const client_secret = process.env['SPOTIFY_CLIENT_SECRET']!;
  const redirect_uri =
    process.env['SPOTIFY_REDIRECT_URI'] || 'http://localhost:3000/api/callback';
  const frontend_uri =
    process.env['SPOTYFILE_FRONTEND_URI'] || 'http://localhost:4200';

  // Check state
  if (!state) {
    const params = new URLSearchParams({ error: 'state_mismatch' });
    return Response.redirect(`/#${params.toString()}`);
  }

  if (!code) return new Response('Missing code', { status: 400 });

  const creds = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  try {
    const tokenResponse = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${creds}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri,
        }),
      }
    );

    const data = await tokenResponse.json();

    if (data.error) {
      return new Response(data, { status: 400 });
    }

    // Redirect to frontend with tokens
    return Response.redirect(
      `${frontend_uri}?access_token=${data.access_token}&refresh_token=${data.refresh_token}`
    );
  } catch (err: any) {
    return new Response(err.message || 'Internal Server Error', {
      status: 500,
    });
  }
}
