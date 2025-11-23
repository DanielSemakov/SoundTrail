// client/src/components/TrackDisplay.jsx
import React from 'react';
import styles from './TrackDisplay.module.css';
import { GenerateEmbedURL } from '../fetch/get-url';
import SongList from './SongList.jsx';

export default function TrackDisplay({ playlist }) {
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&t=${playlist.lastModified}`;
  console.log("Spotify embed URL: " + embedUrl);
  console.log("New spotify embed playlist name: " + playlist.name);

  return (
    <iframe
        key={`${playlist.id}-${playlist.lastModified}`}
        title={playlist.name}
        src={embedUrl}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className={styles['responsive-iframe']}
      />
  );
}
