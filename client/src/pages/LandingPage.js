import React, { useState } from 'react';
import TrackDisplay from '../components/TrackDisplay';
import MoodEnergyChart from '../components/MoodEnergyChart/MoodEnergyChart';
import GenreSelector from '../components/GenreSelector';
import { GetRecommendations } from '../fetch/get-recs';
import { getSeedSongsByGenre } from '../data/seedSongs';
import styles from './LandingPage.module.css';
import { useNavigate } from 'react-router-dom';


export default function LandingPage({ mood, setMood, genre, setGenre, playlist, setPlaylist }) {
  const PLAYLIST_SIZE = 10;
  const features = {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const navigate = useNavigate();
//   const [playlist, setPlaylist] = useState([]);

//   const handleResetMood = () => {
//   // Assuming initial mood for reset is 0.5 for valence and energy
//   setMood({ valence: 0.5, energy: 0.5 });
//   setTrack(null);        // Clear the currently displayed track
//   setError(null);       // Clear any active error messages
//   setLoading(false);    // Ensure loading state is off
//   setPlaylist([]);      // Also clear the playlist if you want a complete reset
// };


//   const handleGenerate = async function() {
//     setLoading(true);
//     setError(null);


//     if (!mood || !genre) {
//       setError('Please select both a mood and a genre.');
//       setLoading(false);
//       return;
//     }


//     var seedsToSend = [];


//     if (genre === '83dc71c7-b9da-466b-a198-bb3c29ee8f00') {
//       seedsToSend = [genre];
//     } else {
//       seedsToSend = getSeedSongsByGenre(genre);
//     }


//     try {
//       if (seedsToSend.length === 0) {
//         setError(
//           'No seed songs found for the genre: "' + genre + '". Please add more songs to songs.json or select a different genre.'
//         );
//         setTrack(null);
//         setPlaylist([]);
//         setLoading(false);
//         return;
//       }


//       var fetchedRecommendations = await GetRecommendations(
//         PLAYLIST_SIZE,
//         seedsToSend,
//         mood,
//         features
//       );


//       if (fetchedRecommendations && fetchedRecommendations.content) {
//         setPlaylist(fetchedRecommendations.content);
//         setTrack(fetchedRecommendations.content[0]);
//       } else {
//         setError('Received empty or invalid recommendations from the server.');
//         setTrack(null);
//         setPlaylist([]);
//       }
//     } catch (err) {
//       console.error('Error generating recommendations:', err);
//       setError('Failed to generate recommendations: ' + err.message);
//       setTrack(null);
//       setPlaylist([]);
//     } finally {
//       setLoading(false);
//     }
//   };


  return (
    <div className={`${styles.container} ${styles.moodChill}`}>
      <header className={styles.header}>
        <h1>Welcome to SoundTrail</h1>
        <p>Discover songs by mood and genre</p>
      </header>
      <div className={styles.card}>
        <h2 className={styles['card-title']}>Your Mood Grid</h2>
        <div className={styles['chart-wrapper']}>
          <MoodEnergyChart updateMood={setMood} mood={mood} trailEnabled={false}/>
        </div>
        <div className={styles.controls}>
          <label>Genre: </label>
          <GenreSelector genre={genre} setGenre={setGenre} dropdownPosition="top"/>
          <button
            className={styles['btn-generate']}
            onClick={() => {
              navigate('/explore');
            }}
            disabled={loading}
          >
            {loading ? 'Generating...' : '🎵 Generate Song'}
          </button>
          {/* <button
            className={styles['btn-reset-mood']}
            onClick={handleResetMood}
            disabled={loading}>
              Reset Mood
          </button> */}
        </div>
        {/* {playlist.length > 1 && (
          <div className={styles['playlist-navigation']}>
            <button onClick={function() { console.log('Previous song'); }}>
              Previous
            </button>
            <button onClick={function() { console.log('Next song'); }}>
              Next
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
}