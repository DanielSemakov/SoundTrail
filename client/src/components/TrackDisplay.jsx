// client/src/components/TrackDisplay.jsx
import React from 'react';
import './TrackDisplay.css';

export default function TrackDisplay({ track }) {
  const embedUrl = `https://open.spotify.com/embed/track/${track.id}?utm_source=generator`;

  return (
    <div className="track-display embed">
      {/* Only the iframe remains */}
      <iframe
        title={track.title}
        src={embedUrl}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
