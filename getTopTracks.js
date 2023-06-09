require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

/**
 * This example retrieves the top tracks for an artist.
 * https://developer.spotify.com/documentation/web-api/reference/artists/get-artists-top-tracks/
 */

/**
 * This endpoint doesn't require an access token, but it's beneficial to use one as it
 * gives the application a higher rate limit.
 *
 * Since it's not necessary to get an access token connected to a specific user, this example
 * uses the Client Credentials flow. This flow uses only the client ID and the client secret.
 * https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow
 */
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(function(data) {
    // Set the access token on the API object so that it's used in all future requests
    spotifyApi.setAccessToken(data.body['access_token']);

    return spotifyApi.getArtistTopTracks('05lIUgmmsmTX2N9dCKc8rC', 'US');
  })
  .then(function(data) {
    console.log('Drum roll..');
    console.log('...');

    data.body.tracks.forEach(function(track, index) {
      console.log(
        index +
          1 +
          '. ' +
          track.name +
          ' (popularity is ' +
          track.popularity +
          ')'
      );
    });
  })
  .catch(function(err) {
    console.log('Unfortunately, something has gone wrong.', err.message);
  });