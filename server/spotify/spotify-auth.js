// spotify-auth.js
// require('dotenv').config();
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const axios = require('axios');

class SpotifyAuth {
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

    console.log('Token exists:', !!this.refreshToken);
    console.log('Token length:', this.refreshToken?.length);
    console.log('First 4 chars:', this.refreshToken?.substring(0, 4));
    console.log('Last 4 chars:', this.refreshToken?.substring(-4));
    console.log('Contains spaces:', this.refreshToken?.includes(' '));
    console.log('Contains newlines:', this.refreshToken?.includes('\n'));
    console.log('Token type (first chars):', this.refreshToken?.substring(0, 10));

    // In-memory token storage
    this.accessToken = null;
    this.tokenExpiresAt = null;
  }

  // Get a valid access token (refresh if needed)
  async getValidAccessToken() {
    // Check if current token is still valid (with 5-minute buffer)
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if (this.accessToken && this.tokenExpiresAt && now < (this.tokenExpiresAt - bufferTime)) {
      console.log('Using existing access token');
      return this.accessToken;
    }

    console.log('Access token expired or missing, refreshing...');
    return await this.refreshAccessToken();
  }


  async refreshAccessToken() {
    try {
      const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
        }
      });

      const { access_token, expires_in } = response.data;
      this.accessToken = access_token;
      this.tokenExpiresAt = Date.now() + (expires_in * 1000);

      console.log('Access token refreshed successfully');
      console.log('Token expires in:', expires_in, 'seconds');

      return this.accessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error.response?.data || error.message);
      throw new Error('Token refresh failed');
    }
  }


  // Refresh the access token using refresh token
  // async refreshAccessToken() {
  //   try {
  //     const response = await axios({
  //       method: 'post',
  //       url: 'https://accounts.spotify.com/api/token',
  //       // data: new URLSearchParams({
  //       //   grant_type: 'refresh_token',
  //       //   refresh_token: this.refreshToken,
  //       //   client_id: this.clientId,
  //       //   client_secret: this.clientSecret
  //       // }),
  //       // headers: {
  //       //   'Content-Type': 'application/x-www-form-urlencoded'
  //       // }
  //       data: new URLSearchParams({
  //         grant_type: 'refresh_token',
  //         refresh_token: this.refreshToken
  //       }),
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //         Authorization: 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
  //       }
  //     });

  //     const { access_token, expires_in } = response.data;
      
  //     // Store the new token and expiration time
  //     this.accessToken = access_token;
  //     this.tokenExpiresAt = Date.now() + (expires_in * 1000); // Convert to milliseconds
      
  //     console.log('Access token refreshed successfully');
  //     console.log('Token expires in:', expires_in, 'seconds');
      
  //     return this.accessToken;
  //   } catch (error) {
  //     console.error('Failed to refresh access token:', error.response?.data || error.message);
  //     throw new Error('Token refresh failed');
  //   }
  // }

  // Make authenticated requests to Spotify API
  async makeSpotifyRequest(method, endpoint, data = null) {
    try {
      const accessToken = await this.getValidAccessToken();
      
      const config = {
        method,
        url: `https://api.spotify.com/v1${endpoint}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      // If we get 401, token might be invalid - try refreshing once
      if (error.response?.status === 401) {
        console.log('Got 401, forcing token refresh...');
        this.accessToken = null; // Clear invalid token
        
        // Try the request again with fresh token
        const accessToken = await this.getValidAccessToken();
        const config = {
          method,
          url: `https://api.spotify.com/v1${endpoint}`,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        };

        if (data) {
          config.data = data;
        }

        const response = await axios(config);
        return response.data;
      }
      
      throw error;
    }
  }
}

//Export a singleton instance
const spotifyAuth = new SpotifyAuth();
module.exports = spotifyAuth;

