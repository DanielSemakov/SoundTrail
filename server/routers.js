// import FetchRecommendation from './controllers'

const express = require('express');
const path = require('path');
const controllers = require('./controllers.js');

const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 4000;

// Serve React static files from the build folder
// app.use(express.static(path.join(__dirname, '../client/build')));

// Define API routes here
app.get('/api/song', (req, res) => {
  res.json({ title: 'Sample Song', artist: 'Artist Name' });
}); 

// API Route for getting al recomendations
app.get ('/playlist/', async (req,res) => {
  const seeds = req.query.seeds.split(',');
  const size = req.query.size;
  const energy = req.query.energy;
  const valence = req.query.valence;
  const features = {energy: energy, valence: valence};

  const response = await controllers.FetchRecommendations(seeds, size, features);
  
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
