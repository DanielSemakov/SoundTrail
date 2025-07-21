import React, { useState } from 'react';
import { useTrack } from '../context/TrackContext';
import TrackDisplay from './TrackDisplay';
import './FloatingTrackBar.css';

export default function FloatingTrackBar() {
  const { track } = useTrack();
  const [minimized, setMinimized] = useState(true);

  if (!track) return null;

  return (
    <div className={`floating-bar ${minimized ? 'minimized' : ''}`}>
      <button className="toggle-button" onClick={() => setMinimized(!minimized)}>
        {minimized ? '▲' : '▼'}
      </button>
      {!minimized && (
        <div className="floating-track-wrapper">
          <TrackDisplay track={track} />
        </div>
      )}
    </div>
  );
}
