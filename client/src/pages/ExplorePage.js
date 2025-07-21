import React, { useState, useEffect } from 'react';
import TrackDisplay from '../components/TrackDisplay';
import MoodEnergyChart from '../components/MoodEnergyChart/MoodEnergyChart';
import { useNavigate, useLocation } from "react-router-dom";
import { GetRecommendations } from '../fetch/get-recs';
import useMoodKeyControls from '../hooks/useMoodKeyControls';
import './ExplorePage.css';

export default function ExplorePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [genre] = useState('83dc71c7-b9da-466b-a198-bb3c29ee8f00');

  const [mood, setMood] = useState(location.state?.mood || { valence: 0.5, energy: 0.5 });
  const [track, setTrack] = useState(location.state?.track || null);

  useMoodKeyControls(mood, setMood);

  useEffect(() => {
    if (!mood) return;

    // Prevent refetching on initial load
    if (
      location.state?.mood?.valence === mood.valence &&
      location.state?.mood?.energy === mood.energy
    ) return;

    GetRecommendations(1, genre, mood).then(res => {
      if (res?.content?.length) {
        setTrack(res.content[0]);
      }
    });
  }, [mood]);

  const adjustMood = (direction) => {
    setMood(prev => {
      let newValence = prev.valence;
      let newEnergy = prev.energy;

      switch (direction) {
        case 'up': newEnergy = Math.min(1, prev.energy + 0.1); break;
        case 'down': newEnergy = Math.max(0, prev.energy - 0.1); break;
        case 'left': newValence = Math.max(0, prev.valence - 0.1); break;
        case 'right': newValence = Math.min(1, prev.valence + 0.1); break;
        default: break;
      }

      return {
        valence: Math.round(newValence * 10) / 10,
        energy: Math.round(newEnergy * 10) / 10
      };
    });
  };

  return (
    <div className="explore-page">
      <header className="explore-header">
        <h1>Explore Songs by Mood</h1>
        <button onClick={() => navigate("/")} className="nav-button">← Back to Home</button>
      </header>

      <div className="explore-body">
        <div className="mood-chart-wrapper">
          <h2 className="section-title">Mood Grid</h2>
          <MoodEnergyChart updateMood={setMood} mood={mood} />
        </div>

        <div className="track-arrow-wrapper">
          <h2 className="section-title">Now Playing</h2>

          <div className="arrow-label">More Energetic ↑</div>
          <div className="arrow-row">
            <button className="arrow-button" onClick={() => adjustMood('up')}>↑</button>
          </div>

          <div className="arrow-row middle">
            <div className="arrow-label">← Sad</div>
            <button className="arrow-button" onClick={() => adjustMood('left')}>←</button>

            <TrackDisplay track={track} />

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
