import React, { useState } from 'react';
import TrackDisplay    from '../components/TrackDisplay';
import MoodEnergyChart from '../components/MoodEnergyChart/MoodEnergyChart';
import { GetRecommendations } from '../fetch/get-recs';
import './LandingPage.css';
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  // constants/potential future params controllable by user? 
  const PLAYLIST_SIZE = 10;
  const features = {}; //optional audio feature params if we want to make recommendations more accurate. 
  // For info on audio features, look on https://reccobeats.com/docs/apis/get-track-audio-features

  const [mood,  setMood]   = useState({valence: 0.5, energy: 0.5});
  const [genre, setGenre]  = useState('83dc71c7-b9da-466b-a198-bb3c29ee8f00');
  const [track, setTrack]  = useState(null);

  const navigate = useNavigate();

  let playlist = {};

  const handleGenerate = () => {
    // TODO: Maybe add popup if no mood or genre has been selected?
    if (!mood || !genre) return;
    
    GetRecommendations(PLAYLIST_SIZE, genre, mood, features).then(fetchedTracks =>{
            playlist = fetchedTracks.content;

            //TODO: Change. This is placeholder that sets the track that appears to first in playlist.
            setTrack(playlist[0]);

            // TODO: add buttons/add functionality that allow for the playlist to be navigated. 
        }) 
  };

  return (

    <div className="container">
      <button onClick={() => navigate("/explore")}>Go to Explore Page</button>
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
          <MoodEnergyChart updateMood={setMood} mood={mood}/>
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
