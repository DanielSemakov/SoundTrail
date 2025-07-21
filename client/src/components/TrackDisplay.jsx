// TrackDisplay.jsx
import React from 'react';
import './TrackDisplay.css';
import { GenerateEmbedURL } from '../fetch/get-url';

export default function TrackDisplay({ track }) {
  if (!track || !track.href) {
    return (
      <div className="track-display embed">
        <p className="placeholder">Loading track...</p>
      </div>
    );
  }

  const embedUrl = GenerateEmbedURL(track);

  return (
    <div className="track-display embed">
      <iframe
  title={track.title}
  src={embedUrl}
  width="100%"
  height="352" // Full player height
  frameBorder="0"
  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
  allowFullScreen
/>

    </div>
  );
}
