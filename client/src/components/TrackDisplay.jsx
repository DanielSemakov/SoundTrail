import React, { useState, useEffect } from 'react';
import '../App.css';      // for font & navbar theme
import './TrackDisplay.css';
import mockData from '../mock/track.json';

export default function TrackDisplay({ query = '' }) {
  const [track, setTrack]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    setIsPlaying(false);

    // Mock loading for Sprint 1
    setTimeout(() => {
      if (mockData.tracks.length) {
        setTrack({
          ...mockData.tracks[0],
          album_cover_url:
            'https://lh3.googleusercontent.com/proxy/OtnStSqFjd2P-A20d09nEkMhjy7MxD2VHw49KUuVsQKs-8D1Bvcl2cydpgKKhdT_iqROm5bCxw7q1pI8PtEN-VOOf1Nk3gUIizP1ROo82xWmkA'
        });
      } else {
        setError('No track available.');
      }
      setLoading(false);
    }, 500);
  }, [query]);

  if (loading)
    return (
      <div className="track-display loading">
        <div className="spinner" />
      </div>
    );
  if (error)
    return (
      <div className="track-display error">⚠️ {error}</div>
    );

  return (
    <div className={`track-display ${isPlaying ? 'playing' : ''}`}>
      <div className="accent-rail" />
      <img className="album-art" src={track.album_cover_url} alt={track.title} />
      <div className="track-info">
        <h2 className="track-title">{track.title}</h2>
        <p className="track-artist">{track.artist}</p>

        {/* Progress bar */}
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: isPlaying ? '30%' : '0%' }}
          />
        </div>

        <div className="track-controls">
          <button className="control-btn" aria-label="Previous">
            ⏮
          </button>
          <button
            className="control-btn play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶️'}
          </button>
          <button className="control-btn" aria-label="Next">
            ⏭
          </button>
        </div>
      </div>
    </div>
  );
}
