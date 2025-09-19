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


  useEffect(() => {
    // GetRecommendations(mood, genre).then(new_track_spotify_id => {
    //   console.log("Spotify ID in explore page: " + new_track_spotify_id);
    //   setTrack(new_track_spotify_id);
    // });

    // getPlaylistRec(mood, genre).then(new_playlist => {
    //   console.log("\nReceived playlist in explore page: " + new_playlist);
    //   setPlaylist(new_playlist);
    // });
    getPlaylistRec(mood, genre).then(new_playlist => {
      if (new_playlist) {  // Only update if we got a valid playlist
        console.log("\nReceived playlist in explore page: " + new_playlist);
        setPlaylist(new_playlist);
      }
    });
  }, [mood, genre, setPlaylist]);

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
            <MoodEnergyChart updateMood={setMood} mood={mood} trailEnabled={true}/>
        </div>
        <div className={styles['playlist-wrapper']}>
          <h2>Your Playlist</h2>
          {playlist ? (
              <TrackDisplay playlist={playlist} className={styles['track-display']}/>
            ) : (
              <div className={styles['placeholder']}>No playlist loaded</div>
            )
          }
        </div>


        {/* <div className={styles['track-arrow-wrapper']}>
          <h2 className={styles['track-section-title']}>Now Playing</h2>

          <div className={styles['arrow-label']}>↑ More Energetic</div>
          <div className={styles['arrow-row']}>
            <button className={styles['arrow-button']} onClick={() => adjustMood('up')}>
              ↑
            </button>
          </div>

          <div className={`${styles['arrow-row']} ${styles.middle}`}>
            <div className={styles['arrow-label']}>← Sad</div>
            <button className={styles['arrow-button']} onClick={() => adjustMood('left')}>
              ←
            </button>

            {playlist ? (
              <TrackDisplay playlist={playlist} className={styles['track-display']}/>
            ) : (
              <div className={styles['placeholder']}>No playlist loaded</div>
            )}

            <button className={styles['arrow-button']} onClick={() => adjustMood('right')}>
              →
            </button>
            <div className={styles['arrow-label']}>Happy →</div>
          </div>

          <div className={styles['arrow-row']}>
            <button className={styles['arrow-button']} onClick={() => adjustMood('down')}>
              ↓
            </button>
          </div>
          <div className={styles['arrow-label']}>↓ More Calm</div>
        </div> */}
      </div> 
    </div>
  );
}
