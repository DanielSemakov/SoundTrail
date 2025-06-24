
import React, { useState } from 'react';
import axios from 'axios';
import MoodGrid from './components/MoodGrid';
import GenreSelector from './components/GenreSelector';
import TrackDisplay from './components/TrackDisplay';
import './App.css';

function App() {
  const [mood, setMood] = useState({ valence: 0.5, energy: 0.5 });
  const [genre, setGenre] = useState('rock');
  const [track, setTrack] = useState(null);

  const fetchRecommendation = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/recommendation', {
        valence: mood.valence,
        energy: mood.energy,
        genre: genre,
      });

      if (response.data.tracks && response.data.tracks.length > 0) {
        setTrack(response.data.tracks[0]);
      } else {
        alert("No tracks found.");
      }
    } catch (error) {
      console.error('Error fetching recommendation:', error);
      alert('Something went wrong fetching track.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SoundTrail</h1>
        <p>Find music that matches your mood.</p>
      </header>
      <main>
        <div className="controls">
          <GenreSelector selectedGenre={genre} onGenreChange={setGenre} />
          <button onClick={fetchRecommendation}>🎵 Get Song</button>
        </div>
        <MoodGrid onMoodChange={setMood} />
        {track && <TrackDisplay track={track} />}
      </main>
    </div>
  );
}

export default App;
