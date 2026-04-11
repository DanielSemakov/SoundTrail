import React, { useState } from 'react';
import MoodEnergyChart from '../components/MoodEnergyChart/MoodEnergyChart';
import GenreSelector from '../components/GenreSelector';
import styles from './LandingPage.module.css';
import { useNavigate } from 'react-router-dom';
import { getPlaylistRec } from '../fetch/get-recs';



export default function LandingPage({ mood, setMood, genre, setGenre, playlist, setPlaylist }) {
  const PLAYLIST_SIZE = 10;
  const features = {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const navigate = useNavigate();

  const handleGeneratePlaylist = () => {
    getPlaylistRec(mood, genre).then(new_playlist => {

      if (new_playlist) {  // Only update if we got a valid playlist
        console.log("\nReceived playlist in explore page: " + new_playlist);
        setPlaylist(new_playlist);
      }
    })
  }


  return (
    <div className={`${styles.container} ${styles.moodChill}`}>
      <header className={styles.header}>
        <h1>Welcome to SoundTrail</h1>
        <p>Discover songs by mood and genre</p>
      </header>
      <div className={styles.card}>
        <h2 className={styles['card-title']}>Your Mood Grid</h2>
        <div className={styles['chart-wrapper']}>
          <MoodEnergyChart updateMood={setMood} mood={mood} trailEnabled={true}/>
        </div>
        <div className={styles.controls}>
          <label>Genre: </label>
          <GenreSelector genre={genre} setGenre={setGenre} dropdownPosition="top"/>
          <button
            className={styles['btn-generate']}
            onClick={() => {
              handleGeneratePlaylist();
              navigate('/explore');
            }}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Playlist'}
          </button>
        </div>
      </div>
    </div>
  );
}