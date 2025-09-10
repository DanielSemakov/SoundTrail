// playlist-generator.js
const express = require('express');
const spotifyAuth = require('./spotify-auth.js'); // Your token manager

const app = express();
app.use(express.json());

// Abstract function to create a playlist
async function createPlaylist(name = 'Recommended Songs', description = "", isPublic = true) {
  try {
    // Get user profile to get user ID
    const userProfile = await spotifyAuth.makeSpotifyRequest('GET', '/me');
    
    // Create the playlist
    const playlist = await spotifyAuth.makeSpotifyRequest('POST', 
      `/users/${userProfile.id}/playlists`, {
        name: name,
        description: description,
        public: isPublic
      }
    );
    
    return {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      url: playlist.external_urls.spotify,
      trackCount: playlist.tracks.total
    };
  } catch (error) {
    console.error('Error creating playlist:', error.message);
    throw error;
  }
}

// Abstract function to add songs to playlist
async function addSongsToPlaylist(playlistId, trackIds) {
  try {
    if (!trackIds || trackIds.length === 0) {
      throw new Error('No tracks provided to add to playlist');
    }
    
    // Add tracks to playlist (max 100 per request)
    const batchSize = 100;
    const results = [];
    
    for (let i = 0; i < trackIds.length; i += batchSize) {
      const batch = trackIds.slice(i, i + batchSize);
      
      const result = await spotifyAuth.makeSpotifyRequest('POST', 
        `/playlists/${playlistId}/tracks`, {
          uris: batch
        }
      );
      
      results.push(result);
    }
    
    return {
      success: true,
      tracksAdded: trackIds.length,
      snapshots: results.map(r => r.snapshot_id)
    };
  } catch (error) {
    console.error('Error adding songs to playlist:', error.message);
    throw error;
  }
}

//Can only replace up to 100 songs
async function replaceSongsInPlaylist(playlistId, trackIds) {
  try {
    if (!trackIds || trackIds.length === 0) {
      throw new Error('No tracks provided to replace in playlist');
    }

    // Spotify allows max 100 tracks per replace request
    const uris = trackIds.slice(0, 100); // truncate if over limit

    const result = await spotifyAuth.makeSpotifyRequest('PUT',
      `/playlists/${playlistId}/tracks`,
      { uris }
    );

    return {
      success: true,
      tracksReplaced: uris.length,
      snapshotId: result.snapshot_id
    };
  } catch (error) {
    console.error('Error replacing songs in playlist:', error.message);
    throw error;
  }
}


module.exports = { createPlaylist, addSongsToPlaylist, replaceSongsInPlaylist };