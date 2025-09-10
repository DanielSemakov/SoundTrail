// import FetchRecommendation from './controllers'
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const path = require('path');
const controllers = require('../song-recommendations/fetch-recs.js');
const cookieParser = require('cookie-parser');

const cors = require('cors');
const { json } = require('stream/consumers');
const getRecommendedSongs = require('../song-recommendations/fetch-playlist.js');
const playlist_generator = require("../spotify/playlist-generator.js");
const sessions = require("../data/sessions.js");


const app = express();

// app.use(cors());

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

app.use(express.json())
app.use(cookieParser());

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

//Main endpoint for generating playlist based on song parameters
app.post('/api/generate-playlist', async (req, res) => {
  console.log('Raw cookie header:', req.headers.cookie);

  const sessionId = req.cookies?.sessionId;
  console.log("User session id identified: " + sessionId);

  if (!sessionId) return res.status(401).send('Missing session ID');

  // Check if session already exists
  let session = sessions.find(s => s.sessionId === sessionId);

  if (!session) {
    // Find an unclaimed playlist slot
    console.log("User is not yet part of a session. Adding user to session...")
    session = sessions.find(s => s.sessionId === null);
    if (!session) return res.status(403).send('No available playlists');

    // Claim it
    session.sessionId = sessionId;
  }

  console.log("User has successfully been added to a session. ");
  console.log("Playlist ID: ", session.playlistId, "\nSession ID: ", sessionId);

  // Only allow any one user/session to modify a playlist if they have not already done so
  // too recently
  const now = Date.now();
  const DEBOUNCE_INTERVAL = 30 * 1000; //30 seconds in ms

  if (session.lastPlaylistUpdateTime && now - session.lastPlaylistUpdateTime < DEBOUNCE_INTERVAL) {
    const waitTime = Math.ceil((DEBOUNCE_INTERVAL - (now - session.lastPlaylistUpdateTime)) / 1000);
    return res.status(429).json({ 
      error: `Please wait ${waitTime} more seconds before modifying the playlist again.` 
    });
  }

  session.lastPlaylistUpdateTime = now;



  try {
    const { valence, energy, genre } = req.body;

    const trackIds = await getRecommendedSongs(valence, energy, genre);
    console.log("Track IDs:\n\n" + trackIds);

    playlistId = session.playlistId;


    const updateNameResult = await playlist_generator.updateName(playlistId, valence, energy, genre);
    const newName = updateNameResult.newName;
    //Create this function so that it clears all current tracks in playlist and then adds new
    //ones, as playlist_generator.addSongsToPlaylist(playlist.id, trackIds); already does.
    await playlist_generator.replaceSongsInPlaylist(playlistId, trackIds);
    console.log("Replaced tracks in playlist.\n")

    //If I'm only returning the playlistId, rather than a dictionary with more playlist info
    //(including the playlist id), as I originally did, then I would have to modify the frontend
    //to reflect this. Maybe I should return more playlist info. Idk.

    const playlist = {
      id: playlistId,
      name: newName,
      description: "description",
      lastModified: session.lastPlaylistUpdateTime
    };




    res.json({ success: true, playlist });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }














  ////////////////////////////////////////////////////////////////////////////////
  //OLD CODE!!!!!!!!!!!!!!
  ////////////////////////////////////////////////////////////////////////////////

//   try {
//     const { valence, energy, genre } = req.body;
    
//     if (valence === undefined || energy === undefined || !genre) {
//       return res.status(400).json({ error: 'Missing required parameters: valence, energy, genre' });
//     }
    

//     const trackIds = await getRecommendedSongs(valence, energy, genre);
//     console.log("Track IDs:\n\n" + trackIds)

//     const playlist = await playlist_generator.createPlaylist();
//     console.log("\n\nCreated playlist\n");

//     await playlist_generator.addSongsToPlaylist(playlist.id, trackIds);
//     console.log("Added tracks to playlist.\n")
    
//     res.json({ success: true, playlist });
    
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
});

//Ping this consistently to keep server up
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime() 
  });
});


app.get('/start-session', (req, res) => {
  const existingSessionId = req.cookies.sessionId;

  if (existingSessionId) {
    return res.json({ sessionId: existingSessionId });
  }
  
  //Prevent duplicate cookies if another request comes in simultaneously
  if (res.headersSent) return;

  const newSessionId = uuidv4();
  res.cookie('sessionId', newSessionId, {
    path: '/',
    httpOnly: true,
    secure: false,
    sameSite: 'Strict'
  });

  res.json({ sessionId: newSessionId });
});


