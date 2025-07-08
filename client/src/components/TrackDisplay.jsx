// client/src/components/TrackDisplay.jsx
import React from 'react';
import './TrackDisplay.css';
import { GenerateEmbedURL } from '../fetch/get-url';

export default function TrackDisplay({ track }) {
  const embedUrl = GenerateEmbedURL(track);

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
