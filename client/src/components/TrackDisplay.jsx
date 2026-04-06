import React from 'react';
import styles from './TrackDisplay.module.css';

export default function TrackDisplay({ playlist }) {
  if (!playlist) return <div className={styles.loading}>Generating playlist...</div>;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.coverPlaceholder}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
        <div className={styles.meta}>
          <p className={styles.playlistName}>{playlist.name}</p>
          <p className={styles.playlistSub}>{playlist.songs.length} songs</p>
        </div>
      </div>

      <div className={styles.trackList}>
        {playlist.songs.map((song, index) => (
          <div key={song.track_id} className={styles.trackRow}>
            <span className={styles.trackNum}>{index + 1}</span>
            <div className={styles.trackArtPlaceholder} />
            <div className={styles.trackInfo}>
              <p className={styles.trackName}>{song.track_name}</p>
              <p className={styles.trackArtist}>{song.track_artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}