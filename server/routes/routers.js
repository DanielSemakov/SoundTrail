// import FetchRecommendation from './controllers'

const express = require('express');
const path = require('path');
const controllers = require('../song-recommendations/fetch-recs.js');

const cors = require('cors');
const { json } = require('stream/consumers');
const getRecommendedSongs = require('../song-recommendations/fetch-playlist.js');
const playlist_generator = require("../spotify/playlist-generator.js");

const app = express();

// app.use(cors());

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

const PORT = process.env.PORT || 4000;

// Serve React static files from the build folder
// app.use(express.static(path.join(__dirname, '../client/build')));


// Define API routes here
app.get('/api/song', (req, res) => {
  res.json({ title: 'Sample Song', artist: 'Artist Name' });
}); 

// API Route for getting al recomendations
app.get ('/playlist/', async (req,res) => {
  const url = req._parsedUrl.query;
  
  const response = await controllers.FetchRecommendations(url);
  
  res.send(response);
});

app.get(`/test`, (req, res) => {
  console.log('works!');
});

// For any other request, serve React's index.html (enables client-side routing)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Route to get song recommendation from CSV file
app.get('/song', async (req, res) => {
  const valence = req.query.valence;  
  const energy = req.query.energy;    
  const genre = req.query.genre;

  const response = await controllers.getRecommendedSong(valence, energy, genre);
  
  res.json({ spotify_id: response });
}); 

// // Main endpoint for generating playlist based on musical parameters
app.post('/api/generate-playlist', async (req, res) => {
  try {
    const valence = req.query.valence;  
    const energy = req.query.energy;    
    const genre = req.query.genre;
    
    if (valence === undefined || energy === undefined || !genre) {
      return res.status(400).json({ error: 'Missing required parameters: valence, energy, genre' });
    }
    
    // const name = playlistName || `${genre} Mix (V:${valence}, E:${energy})`;
    // const description = playlistDescription || `Auto-generated ${genre} playlist`;
    
    const trackIds = await getRecommendedSongs(valence, energy, genre);
    const playlist = await playlist_generator.createPlaylist();
    await playlist_generator.addSongsToPlaylist(playlist.id, trackIds);
    
    res.json({ success: true, playlist });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { }