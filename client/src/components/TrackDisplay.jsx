// client/src/components/TrackDisplay.jsx
import React from 'react';
import styles from './TrackDisplay.module.css';
import { GenerateEmbedURL } from '../fetch/get-url';

export default function TrackDisplay({ track }) {
  const embedUrl = GenerateEmbedURL(track);

  return (
    <div className={styles["track-display-embed"]}>
      {/* Only the iframe remains */}
      <iframe
        title={track.title}
        src={embedUrl}
        // width="100%"
        // height="352" // Full embed height
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className={styles['responsive-iframe']}
      />

    </div>
  );
}
