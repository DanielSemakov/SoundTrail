// ExplorePage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TrackDisplay from '../components/TrackDisplay';
import MoodEnergyChart from '../components/MoodEnergyChart/MoodEnergyChart';
import { GetRecommendations } from '../fetch/get-recs';
import useMoodKeyControls from '../hooks/useMoodKeyControls';
import styles from './ExplorePage.module.css';


export default function ExplorePage({ mood, setMood, genre, setGenre }) {
  const navigate = useNavigate();
  const location = useLocation();


  useMoodKeyControls(mood, setMood);


  const [track, setTrack] = useState(location.state?.track || null);


  const adjustMood = (direction) => {
    setMood((prev) => {
      let { valence, energy } = prev;
      switch (direction) {
        case 'up':
          energy = Math.min(1, energy + 0.1);
          break;
        case 'down':
          energy = Math.max(0, energy - 0.1);
          break;
        case 'left':
          valence = Math.max(0, valence - 0.1);
          break;
        case 'right':
          valence = Math.min(1, valence + 0.1);
          break;
        default:
          break;
      }
      return {
        valence: Math.round(valence * 10) / 10,
        energy: Math.round(energy * 10) / 10,
      };
    });
  };


  useEffect(() => {
    console.log(mood);
    GetRecommendations(1, genre, mood).then((res) => {
      if (res?.content?.length) {
        setTrack(res.content[0]);
      }
    });
  }, [mood, genre]);


  return (
    <div className={styles['explore-page']}>
      <header className={styles['explore-header']}>
        <h1>Explore Songs by Mood</h1>
        <button
          className={styles['nav-button']}
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
      </header>


      <div className={styles['explore-body']}>
        <div className={styles['mood-chart-wrapper']}>
            <h2 className={styles['section-title']}>Mood Grid</h2> 
            <MoodEnergyChart updateMood={setMood} mood={mood} trailEnabled={true}/>
        </div>


        <div className={styles['track-arrow-wrapper']}>
          <h2 className={styles['section-title']}>Now Playing</h2>


          <div className={styles['arrow-label']}>↑ More Energetic</div>
          <div className={styles['arrow-row']}>
            <button
              className={styles['arrow-button']}
              onClick={() => adjustMood('up')}
            >
              ↑
            </button>
          </div>


          <div className={`${styles['arrow-row']} ${styles.middle}`}>
            <div className={styles['arrow-label']}>← Sad</div>
            <button
              className={styles['arrow-button']}
              onClick={() => adjustMood('left')}
            >
              ←
            </button>


            {track ? (
              <TrackDisplay track={track} />
            ) : (
              <div className={styles['placeholder']}>No track loaded</div>
            )}


            <button
              className={styles['arrow-button']}
              onClick={() => adjustMood('right')}
            >
              →
            </button>
            <div className={styles['arrow-label']}>Happy →</div>
          </div>


          <div className={styles['arrow-row']}>
            <button
              className={styles['arrow-button']}
              onClick={() => adjustMood('down')}
            >
              ↓
            </button>
          </div>
          <div className={styles['arrow-label']}>↓ More Calm</div>
        </div>
      </div>
    </div>
  );
}