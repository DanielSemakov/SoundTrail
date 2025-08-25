//require('dotenv').config();
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const axios = require('axios');
//Querystring is deprecated. Change this.
const qs = require('querystring');

// Replace with your actual values
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = 'https://danielsemakov.github.io/SoundTrail/#/explore';
const authorizationCode = ''; 

console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID);
console.log('Client Secret exists:', !!process.env.SPOTIFY_CLIENT_SECRET);

async function exchangeCodeForTokens() {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: redirectUri
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        }
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);
    console.log('Expires In:', expires_in, 'seconds');

    // Store refresh_token securely for future use
  } catch (err) {
    console.error('Token exchange failed:', err.response?.data || err.message);
  }
}

exchangeCodeForTokens();
