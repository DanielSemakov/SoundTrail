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
const cleanUpInactiveSessions = require("../data/sessions_cleanup.js");


const isProduction = process.env.NODE_ENV === 'production';

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

cleanUpInactiveSessions();

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
  // console.log('Raw cookie header:', req.headers.cookie);
  const authHeader = req.headers.authorization;
  const sessionId = authHeader?.replace('Bearer ', '');

  if (!sessionId) return res.status(401).send('Missing session ID');

  //Check if session already exists
  let session = sessions.find(s => s.sessionId === sessionId);

  if (!session) {
    //Find an unclaimed playlist slot
    console.log("User is not yet part of a session. Adding user to session...")
    session = sessions.find(s => s.sessionId === null);
    if (!session) return res.status(403).send('No available playlists');

    //Claim it
    session.sessionId = sessionId;
    session.lastActivityTime = Date.now();
  }

  console.log("User has successfully been added to a session. ");

  // Only allow any one user/session to modify a playlist if they have not already done so
  // too recently
  const now = Date.now();
  const DEBOUNCE_INTERVAL = 15 * 1000; 

  if (session.lastPlaylistUpdateTime && now - session.lastPlaylistUpdateTime < DEBOUNCE_INTERVAL) {
    const waitTime = Math.ceil((DEBOUNCE_INTERVAL - (now - session.lastPlaylistUpdateTime)) / 1000);
    return res.status(429).json({ 
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: `Please wait ${waitTime} more seconds before modifying the playlist again.` 
    });
  }

  session.lastPlaylistUpdateTime = now;



  try {
    const { valence, energy, genre } = req.body;
    console.log("Requested genre:", genre);

    const recommended_songs = await getRecommendedSongs(valence, energy, genre);

    const trackIds = recommended_songs.map(song => song.track_id);
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
      songs: recommended_songs,
      description: "description",
      lastModified: session.lastPlaylistUpdateTime 
    };




    res.json({ success: true, playlist });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Ping this consistently to keep server up
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime() 
  });
});


// app.get('/start-session', async (req, res) => {
//   const existingSessionId = req.cookies.sessionId;

//   if (existingSessionId) {
//     return res.json({ success: true });
//   }
  
//   //Prevent duplicate cookies if another request comes in simultaneously
//   if (res.headersSent) return;

//   const newSessionId = uuidv4();
//   res.cookie('sessionId', newSessionId, {
//     path: '/',
//     httpOnly: true,
//     /** "secure" indicates whether the cookie has to be sent with HTTPS or not. 
//      * "sameSite" indicates whether the frontend and backend are on different domains. 
//      * sameSite: 'None' means different domain and sameSite: 'Lax' means the same domain.
//      * 
//      * When "sameSite" is None, "secure" must be true. I ensure both are true in production.
//      * However, in development, setting up HTTPS for localhost takes some effort, so it is 
//      * better to make "secure" = false and "sameSite" = 'Lax' for convenience.
//     */
//     secure: isProduction, 
//     sameSite: isProduction ? 'None' : 'Lax'
//   });

//   console.log("Successfully assigned new session ID: " + newSessionId);

//   res.json({ success: true });
// });

app.get('/start-session', async (req, res) => {
  const authHeader = req.headers.authorization;
  const existingSessionId = authHeader?.replace('Bearer ', '');
  
  if (existingSessionId) {
    return res.json({ success: true, sessionId: existingSessionId });
  }
  
  const newSessionId = uuidv4();
  console.log("Successfully assigned new session ID: " + newSessionId);
  
  res.json({ success: true, sessionId: newSessionId });
});



app.post('/api/heartbeat', async (req, res) => {
  const authHeader = req.headers.authorization;
  const sessionId = authHeader?.replace('Bearer ', '');

  if (!sessionId) return res.status(401).send("Missing session ID");
  
  console.log("Heartbeat called for user with session ID: " + sessionId + "\nTime: " + Date.now());

  const session = sessions.find(s => s.sessionId === sessionId);

  if (!session) return res.status(500)
    .send("Attempted to update the lastActivityTime before user has been assigned to a session");

  session.lastActivityTime = Date.now();
  console.log("LastActivityTime successfully updated to " + session.lastActivityTime + 
    " for user with session ID: " + sessionId);

  res.status(200).send('OK');
});
