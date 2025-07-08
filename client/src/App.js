// client/src/App.js

import React, { useState } from 'react';
import TrackDisplay    from './components/TrackDisplay';
import MoodEnergyChart from './components/MoodEnergyChart/MoodEnergyChart';
import songs           from './data/songs.json';
import './App.css';

export default function App() {
  const [mood,  setMood]   = useState(null);
  const [genre, setGenre]  = useState('');
  const [track, setTrack]  = useState(null);

  const handleGenerate = () => {
    if (!mood) return;
    const { valence, energy } = mood;
    const candidate = songs
      .filter(s => !genre || s.genre === genre)
      .map(s => ({ 
        ...s, 
        dist: Math.hypot(s.valence - valence, s.energy - energy) 
      }))
      .sort((a,b) => a.dist - b.dist)[0];
    setTrack(candidate || songs[0]);
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
            >
              <option value="">All</option>
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
