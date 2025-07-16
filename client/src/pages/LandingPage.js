
import React, { useState } from 'react';
import TrackDisplay      from '../components/TrackDisplay';
import MoodEnergyChart from '../components/MoodEnergyChart/MoodEnergyChart';
import GenreSelector from '../components/GenreSelector';
import { GetRecommendations } from'../fetch/get-recs';
import { getSeedSongsByGenre } from '../data/seedSongs'; 
import './LandingPage.css';
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const PLAYLIST_SIZE = 10;
  const features = {};

  const [mood, setMood] = useState({valence: 0.5, energy: 0.5});
  
  const [genre, setGenre] = useState('83dc71c7-b9da-466b-a198-bb3c29ee8f00'); 
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState([]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    if (!mood || !genre) {
      setError("Please select both a mood and a genre.");
      setLoading(false);
      return;
    }

    let seedsToSend = []; // Initialize an empty array for seeds

   
    if (genre === '83dc71c7-b9da-466b-a198-bb3c29ee8f00') {
      // If 'All' is selected (by its specific ID value), use that single ID as the seed
      seedsToSend = [genre]; // Send the single ID in an array
      
    } else {
      // For specific genres (rock, pop, hiphop, jazz), get seeds from songs.json
      seedsToSend = getSeedSongsByGenre(genre);
      
    }
   

    try {
      if (seedsToSend.length === 0) {
        setError(`No seed songs found for the genre: "${genre}". Please add more songs to songs.json or select a different genre.`);
        setTrack(null);
        setPlaylist([]);
        setLoading(false);
        return;
      }

      const fetchedRecommendations = await GetRecommendations(PLAYLIST_SIZE, seedsToSend, mood, features);
      
      if (fetchedRecommendations && fetchedRecommendations.content) {
        setPlaylist(fetchedRecommendations.content);
        setTrack(fetchedRecommendations.content[0]); 
      } else {
        setError("Received empty or invalid recommendations from the server.");
        setTrack(null);
        setPlaylist([]);
      }
    } catch (err) {
      console.error("Error generating recommendations:", err);
      setError(`Failed to generate recommendations: ${err.message}`);
      setTrack(null);
      setPlaylist([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <button onClick={() => navigate("/explore")}>Go to Explore Page</button>
      <div className="card">
        <h2 className="card-title">Current Track</h2>
        {loading && <p>Loading recommendations...</p>}
        {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
        {track 
          ? <TrackDisplay track={track}/>
          : !loading && !error && <p className="placeholder">Click “Generate Song” below to start</p>
        }
      </div>

      <div className="card">
        <h2 className="card-title">Your Mood Grid</h2>
        <div className="chart-wrapper">
          <MoodEnergyChart updateMood={setMood} mood={mood}/>
        </div>
        <div className="controls">
          <GenreSelector genre={genre} setGenre={setGenre} />
          <button 
            className="btn-generate" 
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : '🎵 Generate Song'}
          </button>
        </div>
        {playlist.length > 1 && (
            <div className="playlist-navigation">
                <button onClick={() => console.log("Previous song")}>Previous</button>
                <button onClick={() => console.log("Next song")}>Next</button>
            </div>
        )}
      </div>
    </div>
  );
}



