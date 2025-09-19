import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import { useState } from 'react';
import { startSession } from './fetch/get-recs';
import { useEffect } from "react";

export default function App() {
  const [mood, setMood] = useState({ valence: 0.5, energy: 0.5 });
  const [genre, setGenre] = useState('all');
  // const [track, setTrack] = useState(null); 
  const [playlist, setPlaylist] = useState(null); 

  useEffect(() => { 
    startSession(); 
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              mood={mood}
              setMood={setMood}
              genre={genre}
              setGenre={setGenre}
              // track={track}
              // setTrack={setTrack}
              playlist={playlist}
              setPlaylist={setPlaylist}
            />
          }
        />
        <Route
          path="/explore"
          element={
            <ExplorePage
              mood={mood}
              setMood={setMood}
              genre={genre}
              setGenre={setGenre}
              // track={track}
              // setTrack={setTrack}
              playlist={playlist}
              setPlaylist={setPlaylist}
            />
          }
        />
      </Routes>
    </Router>
  );
}
