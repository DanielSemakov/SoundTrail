// src/components/TrackCard.js
import React from 'react';

const TrackCard = ({ track }) => {
  if (!track) return null;

  return (
    <div style={styles.card}>
      <img src={track.albumArt} alt="Album Art" style={styles.image} />
      <h3>{track.name}</h3>
      <p>{track.artist}</p>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '8px',
    width: '250px',
    textAlign: 'center',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  image: {
    width: '100%',
    borderRadius: '4px',
  }
};

export default TrackCard;
