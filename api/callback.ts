export default async (req: any, res: any) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).json({ error: 'Missing code parameter' });
  }

  const client_id = process.env['SPOTIFY_CLIENT_ID']!;
  const client_secret = process.env['SPOTIFY_CLIENT_SECRET']!;
  const redirect_uri =
    process.env['SPOTIFY_REDIRECT_URI'] || 'http://localhost:3000/api/callback';
  const frontend_uri =
    process.env['SPOTYFILE_FRONTEND_URI'] || 'http://localhost:4200';
  const creds = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  console.log(client_id, client_secret, redirect_uri, frontend_uri, creds);
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

    const data: any = await tokenResponse.json();
    // data contains: access_token, refresh_token, expires_in, token_type
    // res.status(200).json(data);
    return res.redirect(`${frontend_uri}?access_token=${data['access_token']}`);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
