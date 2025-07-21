// ExplorePage.js
import React, { useState, useEffect } from 'react';
import TrackDisplay from '../components/TrackDisplay';
import MoodEnergyChart from '../components/MoodEnergyChart/MoodEnergyChart';
import { GetRecommendations } from '../fetch/get-recs';
import { useLocation, useNavigate } from 'react-router-dom';
import './ExplorePage.css';

export default function ExplorePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mood, setMood] = useState(location.state?.mood || { valence: 0.5, energy: 0.5 });
  const [track, setTrack] = useState(location.state?.track || null);
  const [genre] = useState('83dc71c7-b9da-466b-a198-bb3c29ee8f00');

  const adjustMood = (direction) => {
    setMood(prev => {
      let valence = prev.valence;
      let energy = prev.energy;

      switch (direction) {
        case 'up': energy = Math.min(1, energy + 0.1); break;
        case 'down': energy = Math.max(0, energy - 0.1); break;
        case 'left': valence = Math.max(0, valence - 0.1); break;
        case 'right': valence = Math.min(1, valence + 0.1); break;
        default: break;
      }

      return {
        valence: Math.round(valence * 10) / 10,
        energy: Math.round(energy * 10) / 10,
      };
    });
  };

  useEffect(() => {
    if (!mood) return;

    GetRecommendations(1, genre, mood).then(res => {
      if (res?.content?.length) {
        setTrack(res.content[0]);
      }
    });
  }, [mood]);

  return (
    <div className="explore-page">
      <header className="explore-header">
        <h1>Explore Songs by Mood</h1>
        <button className="nav-button" onClick={() => navigate('/')}>← Back to Home</button>
      </header>

      <div className="explore-body">
        <div className="mood-chart-wrapper">
          <h2 className="section-title">Mood Grid</h2>
          <MoodEnergyChart updateMood={setMood} mood={mood} />
        </div>

        <div className="track-arrow-wrapper">
          <h2 className="section-title">Now Playing</h2>

          <div className="arrow-label">↑ More Energetic</div>
          <div className="arrow-row">
            <button className="arrow-button" onClick={() => adjustMood('up')}>↑</button>
          </div>

          <div className="arrow-row middle">
            <div className="arrow-label">← Sad</div>
            <button className="arrow-button" onClick={() => adjustMood('left')}>←</button>

            {track ? <TrackDisplay track={track} /> : <div className="placeholder">No track loaded</div>}

            <button className="arrow-button" onClick={() => adjustMood('right')}>→</button>
            <div className="arrow-label">Happy →</div>
          </div>

          <div className="arrow-row">
            <button className="arrow-button" onClick={() => adjustMood('down')}>↓</button>
          </div>
          <div className="arrow-label">↓ More Calm</div>
        </div>
      </div>
    </div>
  );
}
