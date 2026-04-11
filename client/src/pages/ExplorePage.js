import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrackDisplay from '../components/TrackDisplay';
import MoodEnergyChart from '../components/MoodEnergyChart/MoodEnergyChart';
import { getPlaylistRec } from '../fetch/get-recs';
import useMoodKeyControls from '../hooks/useMoodKeyControls';
import GenreSelector from '../components/GenreSelector';
import styles from './ExplorePage.module.css';

let seeds = [];
let currentSeed;
const MAX_SEEDS_LENGTH = 6;
export default function ExplorePage({ mood, setMood, genre, setGenre, playlist, setPlaylist }) {
  const navigate = useNavigate();
  let features = {loudness: 0, mode: 1};
  
  // Hook for keyboard arrow controls
  useMoodKeyControls(mood, setMood);

  const [backgroundColorClass, setBackgroundColorClass] = useState(null);

  useEffect(() => {
    const valenceEnergySum = Math.round((mood.valence + mood.energy) * 10) / 10;
    console.log("VALENCE ENERGY SUM: " + valenceEnergySum)

    if (valenceEnergySum <= 0.3) {
      setBackgroundColorClass(styles.backgroundBlue);
    }
    else if (valenceEnergySum <= 0.8) {
      setBackgroundColorClass(styles.backgroundGreen);
    }
    else if (valenceEnergySum <= 1.2) {
      setBackgroundColorClass(styles.backgroundYellow);
    }
    else if (valenceEnergySum <= 1.6) {
      setBackgroundColorClass(styles.backgroundRed);
    }
    else {
      setBackgroundColorClass(styles.backgroundPink);
    }
  }, [mood]);

  const adjustMood = (direction) => {
    setMood((prev) => {
      let { valence, energy } = prev;
      const step = 0.1;

      switch (direction) {
        case 'up':
          energy = Math.min(1, energy + step);
          break;
        case 'down':
          energy = Math.max(0, energy - step);
          break;
        case 'left':
          valence = Math.max(0, valence - step);
          break;
        case 'right':
          valence = Math.min(1, valence + step);
          break;
        default:
          break;
      }

      return {
        valence: parseFloat(valence.toFixed(2)),
        energy: parseFloat(energy.toFixed(2)),
      };
    });
  };

  const handleGeneratePlaylist = () => {
    getPlaylistRec(mood, genre).then(new_playlist => {

      if (new_playlist) {  // Only update if we got a valid playlist
        console.log("\nReceived playlist in explore page: " + new_playlist);
        setPlaylist(new_playlist);
      }
    })
  }

  const handleOpenSpotify = () => {
    console.log("Open Spotify button pressed!");
    const playlistUrl = `https://open.spotify.com/playlist/${playlist.id}`; 

    // Open the URL in a new tab
    window.open(playlistUrl, '_blank');
  }

  return (
    <div className={styles['explore-page']}>
      <header className={styles['explore-header']}>
        <h1>Explore Songs by Mood</h1>
        <button className={styles['nav-button']} onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </header>

      <div className={`${styles['explore-body']} ${backgroundColorClass}`}>
        <div className={styles['genre-wrapper']}>
          <h2>Genre</h2>
          <GenreSelector genre={genre} setGenre={setGenre} className={styles.genreSelector}/>
        </div>
        <div className={styles['mood-chart-wrapper']}>
            <h2 className={styles['chart-section-title']}>Mood Grid</h2> 
            <div className={styles['chart-size-wrapper']}>
              <MoodEnergyChart updateMood={setMood} mood={mood} trailEnabled={true}/>
            </div>
            <div className={styles['playlist-button-wrapper']} >
              <button 
                type="button" 
                className={styles['generate-playlist-btn']} 
                onClick={handleGeneratePlaylist}>
                Generate Playlist
              </button>              
            </div>
        </div>
        <div className={styles['playlist-wrapper']}>
          <h2>Your Playlist</h2>
          {/* {playlist ? ( */}
          {playlist ? (
              <div className={styles['track-display-wrapper']}>
                <TrackDisplay playlist={playlist} className={styles['track-display']}/>
                <button 
                  type="button" 
                  className={styles['open-spotify-btn']} 
                  onClick={handleOpenSpotify}>
                  Open in Spotify
              </button>  
              </div>
            ) : (
              <div className={styles['placeholder']}>No playlist loaded</div>
            )
          }
        </div>
      </div> 
    </div>
  );
}
