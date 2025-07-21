import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import { useState } from 'react'

export default function App() {
    const [mood, setMood] = useState({valence: 0.5, energy: 0.5});
    const [genre, setGenre] = useState('83dc71c7-b9da-466b-a198-bb3c29ee8f00'); 

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LandingPage mood={mood} setMood={setMood} genre={genre} setGenre={setGenre}/>}
        />
        <Route
          path="/explore"
          element={<ExplorePage mood={mood} setMood={setMood} genre={genre} setGenre={setGenre}/>}
        />
      </Routes>
    </Router>
  );
}
