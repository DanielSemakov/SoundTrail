// import FetchRecommendation from './controllers'

const express = require('express');
const path = require('path');
const controllers = require('./controllers/fetch-recs.js');

const cors = require('cors');
const { json } = require('stream/consumers');

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
