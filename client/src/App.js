import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import { useState } from 'react'

export default function App() {
    const [mood, setMood] = useState({valence: 0.5, energy: 0.5});
  

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LandingPage mood={mood} setMood={setMood} />}
        />
        <Route
          path="/explore"
          element={<ExplorePage mood={mood} setMood={setMood} />}
        />
      </Routes>
    </Router>
  );
}
