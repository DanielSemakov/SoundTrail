import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TrackDisplay from '../components/TrackDisplay';
import MoodEnergyChart from '../components/MoodEnergyChart/MoodEnergyChart';
import { GetRecommendations } from '../fetch/get-recs';
import useMoodKeyControls from '../hooks/useMoodKeyControls';
import styles from './ExplorePage.module.css';

let seeds = [];
let currentSeed;
const MAX_SEEDS_LENGTH = 6;
export default function ExplorePage({ mood, setMood, genre, setGenre, track, setTrack }) {
  const navigate = useNavigate();
  let features = {loudness: 0, mode: 1};
  
  // Hook for keyboard arrow controls
  useMoodKeyControls(mood, setMood);

  useEffect(() => {
    features.loudness = (mood.energy * 8) - 8;
    features.mode = mood.valence;

    if (seeds.length === 0){
      seeds.push(genre);
    }
    else if (currentSeed) {
      seeds.push(currentSeed);
    }

    if (seeds.length >= MAX_SEEDS_LENGTH){
      seeds.shift();
    }

    // GetRecommendations(1, seeds, mood, features).then((res) => {
    //   if (res?.content?.length) {
    //     const newTrack = res.content[0];
    //     // just to show that a track is being generated. temporary because the spotify 503 errors on their end. 
    //     console.log(newTrack);
    //     if (newTrack?.id) {
    //       setTrack(newTrack);
    //       currentSeed = newTrack.id;
    //     }
    //   }
    // });

    const newTrackSpotifyId = GetRecommendations(mood, genre);
    console.log(newTrackSpotifyId);
    setTrack(newTrackSpotifyId);

  }, [mood, genre, setTrack]);

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

      <div className={styles['explore-body']}>
        <div className={styles['mood-chart-wrapper']}>
            <h2 className={styles['chart-section-title']}>Mood Grid</h2> 
            <MoodEnergyChart updateMood={setMood} mood={mood} trailEnabled={true}/>
        </div>

        <div className={styles['track-arrow-wrapper']}>
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

            {track ? (
              <TrackDisplay track={track} className={styles['track-display']}/>
            ) : (
              <div className={styles['placeholder']}>No track loaded</div>
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
        </div>
      </div>
    </div>
  );
}
