// client/src/App.js

import React, { useState } from 'react';
import TrackDisplay    from './components/TrackDisplay';
import MoodEnergyChart from './components/MoodEnergyChart/MoodEnergyChart';
import { GetRecommendations } from './fetch/get-recs';
import './App.css';

export default function App() {
  // constants/potential future params controllable by user? 
  const PLAYLIST_SIZE = 10;
  const features = {}; //optional audio feature params if we want to make recommendations more accurate

  const [mood,  setMood]   = useState(null);
  const [genre, setGenre]  = useState('');
  const [track, setTrack]  = useState(null);
  let playlist = {};

  const handleGenerate = () => {
    if (!mood) return;

    const { valence, energy } = mood;
    GetRecommendations(PLAYLIST_SIZE, genre, mood, features).then(fetchedTracks =>{
            playlist = fetchedTracks.content;
            // TODO: add buttons that allow for the playlist to be navigated. 
            // just sets track to the first of the playlist for now.
            setTrack(playlist[0]);
        }) 
  };

  return (
    <div className="container">
      {/* Track Card */}
      <div className="card">
        <h2 className="card-title">Current Track</h2>
        {track 
          ? <TrackDisplay track={track}/>
          : <p className="placeholder">Click “Generate Song” below to start</p>
        }
      </div>

      {/* Mood Card */}
      <div className="card">
        <h2 className="card-title">Your Mood Grid</h2>

        <div className="chart-wrapper">
          <MoodEnergyChart updateMood={setMood}/>
        </div>

        <div className="controls">
          <div className="genre-container">
            <label htmlFor="genre">Genre</label>
            <select 
              id="genre" 
              value={genre} 
              onChange={e => setGenre(e.target.value)}

              // put music seeds below
            >
              <option value="83dc71c7-b9da-466b-a198-bb3c29ee8f00">All</option>
              <option value="rock">Rock</option>
              <option value="pop">Pop</option>
              <option value="hiphop">Hip-Hop</option>
              <option value="jazz">Jazz</option>
            </select>
          </div>

          <button className="btn-generate" onClick={handleGenerate}>
            🎵 Generate Song
          </button>
        </div>
      </div>
    </div>
  );
}
