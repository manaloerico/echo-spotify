export default async (req: any, res: any) => {
  const code = req.query.code as string | undefined;
  const state = req.query.state as string | undefined;

  const client_id = process.env['SPOTIFY_CLIENT_ID']!;
  const client_secret = process.env['SPOTIFY_CLIENT_SECRET']!;
  const redirect_uri =
    process.env['SPOTIFY_REDIRECT_URI'] || 'http://localhost:3000/api/callback';
  const frontend_uri =
    process.env['SPOTIFY_FRONTEND_URI'] || 'http://localhost:4200';

  // Check state
  if (!state) {
    const params = new URLSearchParams({ error: 'state_mismatch' });
    return res.redirect(`/#${params.toString()}`);
  }

  if (!code) {
    return res.status(400).json({ error: 'Missing code parameter' });
  }

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
      return res.status(400).json(data);
    }

    // Redirect to frontend with tokens
    return res.redirect(
      `${frontend_uri}?access_token=${data.access_token}&refresh_token=${data.refresh_token}`
    );
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || 'Internal Server Error' });
  }
};
