import React, { useState } from 'react';
import TrackDisplay from '../components/TrackDisplay';
import MoodEnergyChart from '../components/MoodEnergyChart/MoodEnergyChart';
import GenreSelector from '../components/GenreSelector';
import { GetRecommendations } from '../fetch/get-recs';
import './LandingPage.css';
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const PLAYLIST_SIZE = 10;
  const features = {};

  const [mood, setMood] = useState({ valence: 0.5, energy: 0.5 });
  const [genre, setGenre] = useState('83dc71c7-b9da-466b-a198-bb3c29ee8f00');
  const [track, setTrack] = useState(null);

  const handleGenerate = () => {
    if (!mood || !genre) return;

    GetRecommendations(PLAYLIST_SIZE, genre, mood, features).then(fetchedTracks => {
      if (fetchedTracks?.content?.length) {
        setTrack(fetchedTracks.content[0]);
      }
    });
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="explore-header">
        <h1>Discover Songs by Mood</h1>
      </header>

      <div className="container">
        {/* Track Card */}
        <div className="card">
          <h2 className="card-title">Current Track</h2>
          {track
            ? <TrackDisplay track={track} />
            : <p className="placeholder">Select a mood and click “Generate Song”</p>
          }
        </div>

        {/* Mood + Controls */}
        <div className="card">
          <h2 className="card-title">Your Mood Grid</h2>

          <div className="chart-wrapper">
            <MoodEnergyChart updateMood={setMood} mood={mood} />
          </div>

          <div className="controls">
            <GenreSelector genre={genre} setGenre={setGenre} />

            <button className="btn-generate" onClick={handleGenerate}>
              🎵 Generate Song
            </button>

            <button
              onClick={() => navigate("/explore", { state: { mood, track } })}
              className="btn-generate"
              disabled={!track}
            >
              🚀 Go to Explore Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
