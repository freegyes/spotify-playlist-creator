require('dotenv').config();
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

// Set up Spotify API credentials
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

app.get('/login', (req, res) => {
  const scopes = ['user-read-private', 'user-read-email'];
  const state = 'spotify-auth-state';
  res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    res.redirect('/search');
  } catch (err) {
    console.error('Error getting tokens:', err);
    res.redirect('/login');
  }
});

app.get('/search', async (req, res) => {
  try {
    const data = await spotifyApi.searchTracks('Rival consoles');
    const tracks = data.body.tracks.items.map((track) => track.name);
    res.send(tracks);
  } catch (err) {
    console.error('Error searching tracks:', err);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});